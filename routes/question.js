var express = require('express');
var router = express.Router();
var User = require('../db/User');
var Question = require('../db/Question');
var Answer = require('../db/Answer');
var path = require('path');
var Sequelize = require('sequelize');
var _und = require('underscore');

var sequelize = new Sequelize('sumo', 'root', 'sumoadmin', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

/* test modal */
router.get('/modal', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/modal.html'));
});

router.get('/', function(req, res) {
  var userId = req.session.userId;
  var randomNum;
  var answeredQuestions;
  if (!userId) {
    return Question.findAll({})
      .then(function(questions) {
        var questionIds = [];
        var questionsObj = {};
        if (!questions)
          throw new Error('No questions in databse.');

        console.log(questions);
        questions.forEach(function(log) {
          var question = log.get().question;
          var answerChoices = JSON.parse(log.get().answerChoices);
          var questionId = log.get().questionId;
          questionIds.push(questionId);
          questionsObj[questionId] = { 'id': questionId, 'question': question, 'choices': answerChoices };
        })

        // questionIds = _und.difference(questionIds, answeredQuestions);
        // console.log(questionIds);
        if (questionIds.length === 0)
          throw new Error('No new questions for user.');
        var randomNum = getRandomInt(0, questionIds.length);
        console.log(randomNum);
        res.send(questionsObj[questionIds[randomNum]]);
        return true;
      })
      .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e.message });
        return e;
      });
  }
  return sequelize.transaction(function(t) {
      return User.findOne({
          where: {
            userId: userId,
            admin: false
          }
        }, { transaction: t })
        .then(function(user) {
          if (!user)
            throw new Error('user does not exist or is an admin.');
          answeredQuestions = user.answered;
          if (answeredQuestions) {
            answeredQuestions = JSON.parse(answeredQuestions);
          } else
            answeredQuestions = [];

          return Question.findAll({
              transaction: t
            })
            .then(function(questions) {
              var questionIds = [];
              var questionsObj = {};
              if (!questions)
                throw new Error('No questions in databse.');

              console.log(questions);
              questions.forEach(function(log) {
                var question = log.get().question;
                var answerChoices = JSON.parse(log.get().answerChoices);
                var questionId = log.get().questionId;
                questionIds.push(questionId);
                questionsObj[questionId] = { 'id': questionId, 'question': question, 'choices': answerChoices };
              })
              console.log(questionsObj);
              console.log('questionIds');
              console.log(questionIds);
              console.log('answered ids');
              console.log(answeredQuestions);
              console.log(_und.difference(questionIds, answeredQuestions));
              questionIds = _und.difference(questionIds, answeredQuestions);
              console.log(questionIds);
              if (questionIds.length === 0)
                throw new Error('No new questions for user.');
              var randomNum = getRandomInt(0, questionIds.length);
              console.log(randomNum);
              // res.send(questionsObj[questionIds[randomNum]]);
              return questionsObj[questionIds[randomNum]];
            })
        })
    })
    .then(function(result) {
      console.log(result);
      res.send(result);
      return true;
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e.message });
      return e;
    });
});

/*
  Parse answer and update questions, user, and
 */
router.post('/answer', function(req, res) {
  var userId = req.session.userId;
  var answerObj = JSON.parse(req.body.answer);
  var questionId = answerObj.id;
  var question = answerObj.question;
  var answerIndex = parseInt(answerObj.answer);
  var answer = answerObj.choices[answerIndex];
  var questionAnswers;

  //If the user is a guest record answer only
  if (!userId) {
    return sequelize.transaction(function(t) {
        return Question.findOne({
            where: {
              'questionId': questionId
            }
          }, { transaction: t })
          .then(function(result) {
            if (!result)
              throw new Error('question does not exist.');
            questionAnswers = JSON.parse(result.answer);
            questionAnswers[answerIndex] = questionAnswers[answerIndex] + 1;
            questionAnswers = JSON.stringify(questionAnswers);
            return Question.update({
              'answer': questionAnswers
            }, {
              where: {
                'questionId': questionId
              }
            }, { transaction: t })
          })
      })
      .then(function(result) {
        console.log(result);
        res.send({ error: '' });
        return true;
      })
      .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e.message });
        return e;
      });
  }

  //if user record answer and update tables with answer
  return sequelize.transaction(function(t) {
      return Question.findOne({
          where: {
            'questionId': questionId
          }
        }, { transaction: t })
        .then(function(result) {
          if (!result)
            throw new Error('question does not exist.');
          questionAnswers = JSON.parse(result.answer);
          questionAnswers[answerIndex] = questionAnswers[answerIndex] + 1;
          questionAnswers = JSON.stringify(questionAnswers);
          return Question.update({
              'answer': questionAnswers
            }, {
              where: {
                'questionId': questionId
              }
            }, { transaction: t })
            .then(function() {
              return Answer.create({
                  'question': question,
                  'questionId': questionId,
                  'userId': userId,
                  'answer': answer
                }, { transaction: t })
                .then(function() {

                  return User.findOne({
                      where: { userId: userId }
                    }, { transaction: t })
                    .then(function(user) {
                      if (!user)
                        throw new Error('user does not exist.');
                      var answeredQuestions = user.answered;
                      if (!answeredQuestions)
                        answeredQuestions = [];
                      else
                        answeredQuestions = JSON.parse(answeredQuestions);
                      answeredQuestions.push(questionId);
                      answeredQuestions = JSON.stringify(answeredQuestions);
                      return User.update({
                        answered: answeredQuestions
                      }, {
                        where: { userId: userId }
                      }, { transaction: t })
                    })
                })
            })
        })
    })
    .then(function(result) {
      console.log(result);
      res.send({ error: '' });
      return true;
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e.message });
      return e;
    });
})

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = router;
