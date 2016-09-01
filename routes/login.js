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
  var username = req.body.username;
  var password = req.body.password;
  var id;
  var displayname;
  var inputValid = checkInputs(username);
  if (inputValid.error) {
    return;
  }
  User.findOne({
      where: {
        email: username
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
        req.session.userId = id;
        req.session.displayName = displayname;
        res.send({ error: '', redirect: '/users/user/' + displayname });
        return true;
      }
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e });
      return e;
    });
});

// check login credentials and validate them
function checkInputs(username) {
  console.log('checking inputs');
  if (!/[\w.+-_]+@[\w.-]+.[\w]+/.test(username))
    return { error: 'Invalid username was submitted.' };
  else
    return { error: '' };
}

module.exports = router;
