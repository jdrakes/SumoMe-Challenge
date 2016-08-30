var express = require('express');
var router = express.Router();

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

module.exports = router;
