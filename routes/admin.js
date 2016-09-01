var express = require('express');
var router = express.Router();
var User = require('../db/User');
var Question = require('../db/Question');
var Answer = require('../db/Answer');
var path = require('path');

// GET login page
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/adminlogin.html'));
});

// Get if admin user is logged
router.get('/loggedin', function(req, res, next) {
  var session = req.session;
  if (!session.userId) {
    res.status(400).send({ username: null });
  } else {
    User.findOne({
        where: {
          userId: session.userId,
          admin: true
        }
      })
      .then(function(user) {
        if (!user) {
          res.status(400).send({ error: 'Not an admin.' });
          return false;
        } else {
          res.send({ username: session.userId });
          return true;
        }
      })
      .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e.message });
        return e;
      });
  }
});

// Get if admin user is logged in permission
router.get('/loggedin/permission', function(req, res, next) {
  var session = req.session;
  if (!req.session.userId) {
    res.status(400).send({ username: null });
  } else {
    User.findOne({
        where: {
          userId: session.userId,
          admin: true
        }
      })
      .then(function(user) {
        if (!user) {
          res.redirect('/');
          return;
        } else {
          res.send({ username: session.userId });
          return;
        }
      })
      .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e.message });
        return e;
      });
  }
});

// Process login information
router.post('/login_action', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var inputValid = checkInputs(username);
  var session = req.session;
  var id;
  var displayname;

  if (inputValid.error) {
    console.log(inputValid);
    return;
  }
  User.findOne({
      where: {
        email: username,
        admin: true
      }
    })
    .then(function(user) {
      if (!user) {
        res.status(400).send({ error: 'Username not found. Please try again.' });
        return false;
      } else if (user.password != password || user.email != username) {
        console.log('wrong password, got ' + password + ', expected ' + user.password);
        res.status(400).send({ error: 'Password was incorrect. Please try again.' });
        return false;
      } else {
        id = user.userId;
        displayname = user.displayName;
        session.userId = id;
        session.displayName = displayname;
        res.send({ error: '', redirect: '/admin/user/' + id });
        return true;
      }
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e.message });
      return e;
    });
});

// Get log out user
router.get('/logout', authenticatedAdmin, function(req, res) {
  console.log('logging out');
  req.session.destroy();
  res.redirect('/');
});

// GET users page
router.get('/user/:userId', authenticatedAdmin, function(req, res, next) {
  var session = req.session;
  var userId = req.params.userId;
  var userId = session.userId;
  if (!session) {
    res.redirect('/');
    return;
  } else if (!session.userId && !session.displayName) {
    res.redirect('/');
    return;
  }

  User.findOne({
      where: {
        userId: userId,
        admin: true
      }
    })
    .then(function(user) {
      if (!user) {
        if (userId !== session.userId) {
          res.redirect('/');
          return;
        } else {
          req.session.destroy();;
          res.redirect('/');
          return false;
        }
      }
      res.sendFile(path.join(__dirname, '../public/adminuser.html'));
      return true;
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e.message });
      return e;
    });
});

// Create Question Handl
router.post('/question', authenticatedAdmin, function(req, res) {
  var body = req.body;
  var question = body.question;
  var choice1 = body.choice1;
  var choice2 = body.choice2;
  var choice3 = body.choice3;
  if (body.question && body.choice1 && body.choice2 && body.choice3) {
    Question.sync({ force: false })
      .then(function() {
        console.log('Creating Question');
        Question.create({
            'question': question,
            'answerChoices': JSON.stringify([choice1, choice2, choice3]),
            'answer': JSON.stringify([0, 0, 0])
          })
          .then(function() {
            res.send({ error: '' });
            return true;
          })
      })
      .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e.message });
        return e;
      });
  } else if (body.question && body.choice1 && body.choice2) {
    Question.sync({ force: false })
      .then(function() {
        console.log('Creating Question');
        Question.create({
            'question': question,
            'answerChoices': JSON.stringify([choice1, choice2]),
            'answer': JSON.stringify([0, 0])
          })
          .then(function() {
            res.send({ error: '' });
            return true;
          })
      })
      .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e.message });
        return e;
      });
  } else {
    res.status(400).send({ error: 'Invalid inputs submitted. Please fill out question box and answer choices one and two.' })
  }
});

router.get('/questionIds', authenticatedAdmin, function(req, res) {
  return Question.findAll({})
    .then(function(questions) {
      var questionIds = [];
      var questionsObj = {};
      var question;
      var questionId;
      if (!questions)
        throw new Error('No questions in databse.');

      questions.forEach(function(log) {
        question = log.get().question;
        questionId = log.get().questionId;
        questionIds.push({ 'id': questionId, 'question': question });
      })
      if (questionIds.length === 0)
        throw new Error('No new questions for user.');
      res.send(questionIds);
      return questionIds;
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e.message });
      return e;
    });
});

/// Retrieve results from quiestion by
router.get('/question/:id', authenticatedAdmin, function(req, res) {
  var questionId = req.params.id;
  return Question.findOne({
      where: { questionId: questionId }
    })
    .then(function(questions) {
      var choices = JSON.parse(questions.answerChoices);
      var answers = JSON.parse(questions.answer);
      var results = [];
      var questionIds = [];
      var resultObj = {};
      if (!questions)
        throw new Error('Questions does not exist.');

      for (c in choices) {
        results.push({ answer: choices[c], result: answers[c] });
      }
      resultObj = { id: questionId, question: questions.question, results: results };
      res.send(resultObj);
      return resultObj;
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e.message });
      return e;
    });
});

// Verify is user has been authenticated in session.
function authenticatedAdmin(req, res, next) {
  if (req.session.userId) {
    User.findOne({
        where: {
          userId: req.session.userId,
          admin: true
        }
      })
      .then(function(user) {
        if (!user) {
          res.redirect('/');
          return false;
        } else
          return next();
      })
      .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e.message });
        return e;
      });
  } else
    res.redirect('/');
}


function checkInputs(username) {
  if (!/[\w.+-_]+@[\w.-]+.[\w]+/.test(username))
    return { error: 'Invalid username was submitted.' };
  else
    return { error: '' };
}
module.exports = router;
