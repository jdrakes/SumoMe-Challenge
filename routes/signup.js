var express = require('express');
var router = express.Router();
var _und = require('underscore');
var User = require('../db/User');
var path = require('path');
var shortid = require('shortid');

// GET signup page.
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
});

// Proccess signup information.
router.post('/signup_action', function(req, res) {
  var email = req.body.email;
  var userName = req.body.display;
  var result = null;
  var validInputs;
  delete req.body.re_password;
  validInputs = checkInputs(req.body);
  if (validInputs.error !== '') {
    res.send(validInputs);
    return;
  }

  // Validate unique email and username
  User.findAll({
      where: {
        email: email
      }
    })
    .then(function(user) {
      if (user)
        result = user;
      return result;
    })
    .then(function(user) {
      console.log('Made it to email check');
      if (user)
        return { error: 'Email address has already been used to create an account.' };
      User.findAll({
          where: {
            userId: userName
          }
        })
        .then(function(user) {
          if (user)
            return { error: 'Username has already been used to create an account.' };
          else
            return { error: '' }
        })
    })
    .then(function(response) {
      if (response.error) {
        addUser(req.body);
        res.send({ error: '', redirect: '/login' });
        return true;
      } else {
        res.statusMessage = err.error;
        res.status(400).send(err);
        return false;
      }
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e });
      return e;
    });
});

// Validate inputs are not malicious or incorrect;

function checkInputs(inputsObj) {
  var expectedKeys = ['first_name', 'last_name', 'email', 'display', 'password'];
  var inputs = _und.values(inputsObj);
  var keys = _und.keys(inputsObj);

  if (keys.length !== expectedKeys.length) {
    return { error: 'Unexpected number of inputs submitted.' };
  } else {
    for (var i = 0; i < keys.length; i++) {
      if (!_und.has(inputsObj, keys[i]))
        return { error: 'Unexpected input was submitted.' };
    }
  }
  if (_und.contains(inputs, '')) {
    return { error: 'There were empty inputs submitted.' };
  } else if (!/[\w.+-_]+@[\w.-]+.[\w]+/.test(inputsObj.email))
    return { error: 'Invalid email address was submitted.' };
  else if (!/^[a-z0-9]+$/i.test(inputsObj.display))
    return { error: 'Invalid username was submitted.' };
  else
    return { error: '' };
}

// Add new user to mongo database;

function addUser(userinfo) {
  User.sync({ force: false })
  .then(function() {
    // Table created
    console.log('User Table Created');
    return User.create({
      firstName: userinfo.first_name,
      lastName: userinfo.last_name,
      userId: shortid.generate(),
      displayName: userinfo.display,
      email: userinfo.email,
      password: userinfo.password,
      admin: false
    });
  });
}

module.exports = router;
