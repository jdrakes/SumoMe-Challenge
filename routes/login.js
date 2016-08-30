var express = require('express');
var router = express.Router();
var _und = require('underscore');
var User = require('../db/User');
var path = require('path');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

/* Process login information. */
router.post('/login_action', function(req, res) {
  console.log(req.body);
  username = req.body.username;
  password = req.body.password;
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
        "email": username
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
        var id = user.userId;
        var displayname = user.displayName;
        console.log("success?");
        console.log(id, displayname);
        req.session.userId = id;
        req.session.displayName = displayname;
        res.send({ error: "", redirect: '/users/user/' + id });
        return true;
      }
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e });
      return e;
    });
});

function checkInputs(username) {
  console.log('checking inputs');
  if (!/[\w.+-_]+@[\w.-]+.[\w]+/.test(username))
    return { error: "Invalid username was submitted." };
  else
    return { error: "" };
}

module.exports = router;
