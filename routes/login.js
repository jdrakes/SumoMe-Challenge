var express = require('express');
var router = express.Router();
var _und = require('underscore');
var User = require('../db/User');
var path = require('path');

// GET login page.
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Process login information
router.post('/login_action', function(req, res) {
  var userName = req.body.username;
  var password = req.body.password;
  var inputValid = checkInputs(userName);
  var id;
  var displayName;
  if (inputValid.error) {
    return;
  }
  User.findOne({
      where: {
        email: userName
      }
    })
    .then(function(user) {
      if (!user) {
        res.status(400).send({ error: 'Username not found. Please try again.' });
        return false;
      } else if (user.password != password || user.email != userName) {
        console.log('wrong password, got ' + password + ', expected ' + user.password);
        res.status(400).send({ error: 'Password was incorrect. Please try again.' });
        return false;
      } else {
        id = user.userId;
        displayName = user.displayName;
        req.session.userId = id;
        req.session.displayName = displayName;
        res.send({ error: '', redirect: '/users/user/' + displayName });
        return true;
      }
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e.message });
      return e;
    });
});

// check login credentials and validate them
function checkInputs(userName) {
  console.log('checking inputs');
  if (!/[\w.+-_]+@[\w.-]+.[\w]+/.test(userName))
    return { error: 'Invalid username was submitted.' };
  else
    return { error: '' };
}

module.exports = router;
