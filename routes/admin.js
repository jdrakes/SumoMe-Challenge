var express = require('express');
var router = express.Router();
var User = require('../db/User');
var Question = require('../db/Question');
var Answer = require('../db/Answer');
var path = require('path');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/adminlogin.html'));
});

/*Get if user is logged in*/
router.get('/loggedin', function(req, res, next) {
  console.log(req.session.userId);
  if (!req.session.userId) {
    res.status(400).send({ username: null });
  } else {
    User.findOne({
        where: {
          "userId": req.session.userId,
          "admin": true
        }
      })
      .then(function(user) {
        console.log(user);
        if (!user) {
          res.redirect('/');
          return;
        } else {
          res.send({ username: req.session.userId });
          return;
        }
      })
      .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e });
        return e;
      });
  }
});

/* Process login information. */
router.post('/login_action', function(req, res) {
  console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;
  var id;
  var displayname;
  console.log(username, password);
  console.log("I made it");
  var inputValid = checkInputs(username);
  console.log(inputValid);
  if (inputValid.error !== "") {
    console.log(inputValid);
    return;
  }
  User.findOne({
      where: {
        "email": username,
        "admin": true
      }
    })
    .then(function(user) {
      console.log("user is" + user);
      console.log(user);
      if (!user) {
        console.log("!user");
        res.status(400).send({ error: 'Username not found. Please try again.' });
        return false;
      } else if (user.password != password || user.email != username) {
        console.log("wrong password, got " + password + ", expected " + user.password);
        res.status(400).send({ error: 'Password was incorrect. Please try again.' });
        return false;
      } else {
        id = user.userId;
        displayname = user.displayName;
        console.log("success?");
        console.log(id, displayname);
        req.session.userId = id;
        req.session.displayName = displayname;
        res.send({ error: "", redirect: '/admin/user/' + id });
        return true;
      }
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e });
      return e;
    });
});

/*Get user log out*/
router.get('/logout', authenticatedAdmin, function(req, res) {
  console.log('logging out');
  req.session.destroy();
  res.redirect('/');
});

/* GET users listing. */
router.get('/user/:userId', authenticatedAdmin, function(req, res, next) {
  var userId = req.params.userId;
  var userId = req.session.userId;
  console.log(req.session);
  if (!req.session) {
    res.redirect('/');
    return;
  } else if (!req.session.userId && !req.session.displayName) {
    res.redirect('/');
    return;
  }

  User.findOne({
      where: {
        "userId": userId,
        "admin": true
      }
    })
    .then(function(user) {
      console.log(user);
      if (!user) {
        if (userId !== req.session.userId) {
          res.redirect('/');
          return;
        } else {
          req.session.destroy();;
          res.redirect('/');
          return;
        }
      }
      res.sendFile(path.join(__dirname, '../public/adminuser.html'));
      return;
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e });
      return e;
    });
});

/*Create Question Handler*/
router.post('/question', authenticatedAdmin, function(req, res) {
  console.log(req.body);
  var body = req.body;
  var question = body.question;
  var choice1 = body.choice1;
  var choice2 = body.choice2;
  var choice3 = body.choice3;
  if (body.question && body.choice1 && body.choice2 && body.choice3){
      Question.sync({force: false})
      .then(function(){
        console.log('Creating Question');
        Question.create({
            'question': question,
            'answerChoices': JSON.stringify([choice1,choice2,choice3]),
            'answer': JSON.stringify([0,0,0])
        })
        .then(function(){
          res.send({error: ''});
          return;
        })
      })
       .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e });
        return e;
      });
  }
  else if(body.question && body.choice1 && body.choice2 ){
      Question.sync({force: false})
      .then(function(){
        console.log('Creating Question');
        Question.create({
            'question': question,
            'answerChoices': JSON.stringify([choice1,choice2]),
            'answer': JSON.stringify([0,0])
        })
        .then(function(){
          res.send({error: ''});
          return;
        })
      })
       .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e });
        return e;
      });
  }
  else{
    res.status(400).send({error: 'Invalid inputs submitted. Please fill out question box and answer choices one and two.'})
  }
});

/*
    Verify is user has been authenticated in session.
 */
function authenticatedAdmin(req, res, next) {
  console.log(req.session);
  if (req.session.userId) {
    User.findOne({
        where: {
          "userId": req.session.userId,
          "admin": true
        }
      })
      .then(function(user) {
        console.log(user);
        if (!user) {
          res.redirect('/');
          return;
        } else
          return next();
      })
      .catch(function(e) {
        console.log(e);
        res.status(400).send({ error: e });
        return e;
      });
  } else
    res.redirect('/');
}


function checkInputs(username) {
  console.log('checking inputs');
  if (!/[\w.+-_]+@[\w.-]+.[\w]+/.test(username))
    return { error: "Invalid username was submitted." };
  else
    return { error: "" };
}
module.exports = router;
