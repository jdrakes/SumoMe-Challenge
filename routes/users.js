var express = require('express');
var router = express.Router();
var User = require('../db/User');
var path = require('path');

//Get if user is logged in
router.get('/loggedin', function(req, res, next) {
  var session = req.session;
  if (!session) {
    res.status(400).send({ username: null });
  } else if (!session.userId) {
    res.status(400).send({ username: null });
  }else if (session.userId === 'guest') {
    res.status(400).send({ username: null });
  } else {
    res.send({ username: session.displayName });
  }
});

// Get user log out
router.get('/logout', authenticated, function(req, res) {
    console.log('logging out');
    req.session.destroy();
    res.redirect('/');
});

// GET users listing.
router.get('/user/:displayName', authenticated, function(req, res, next) {
  var displayName = req.params.displayName;
  var userId = req.session.userId;
  var session = req.session;
  if (!session) {
    res.redirect('/');
    return;
  } else if (!session.userId && !session.displayName) {
    res.redirect('/');
    return;
  }
  else if(session.userId === 'guest'){
    res.redirect('/');
  }

  User.findOne({
      where: {
        displayName: displayName
      }
    })
    .then(function(user) {
      console.log(user);
      if (!user) {
        if (displayName !== session.displayName) {
          res.redirect('/');
          return;
        } else {
          session.destroy();;
          res.redirect('/');
          return false;
        }
      }
      res.sendFile(path.join(__dirname, '../public/user.html'));
      return true;
    })
    .catch(function(e) {
      console.log(e);
      res.status(400).send({ error: e.message });
      return e;
    });
});

// Verify is user has been authenticated in session.
function authenticated(req, res, next) {
  console.log(req.session);
  if (req.session.userId) {
    return next();
  }
  res.redirect('/');
}
module.exports = router;
