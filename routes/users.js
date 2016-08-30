var express = require('express');
var router = express.Router();
var User = require('../db/User');
var path = require('path');

/*Get if user is logged in*/
router.get('/loggedin', function(req, res, next) {
  console.log(req.session.userId);
  if (!req.session) {
    res.status(400).send({ username: null });
  } else if (!req.session.userId) {
    res.status(400).send({ username: null });
  } else {
    res.send({ username: req.session.displayName });
  }
});

/*Get user log out*/
router.get('/logout', authenticated, function(req, res) {
    console.log('logging out');
    req.session.destroy();
    res.redirect('/');
});

/* GET users listing. */
router.get('/user/:displayName', authenticated, function(req, res, next) {
  var displayName = req.params.displayName;
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
        "displayName": displayName
      }
    })
    .then(function(user) {
      console.log(user);
      if (!user) {
        if (displayName !== req.session.displayName) {
          res.redirect('/');
          return;
        } else {
          req.session.destroy();;
          res.redirect('/');
          return;
        }
      }
      res.sendFile(path.join(__dirname, '../public/user.html'));
      return;
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e });
      return e;
    });
});

/*
    Verify is user has been authenticated in session.
 */
function authenticated(req, res, next) {
  console.log(req.session);
  if (req.session.userId) {
    return next();
  }
  res.redirect('/');
}
module.exports = router;
