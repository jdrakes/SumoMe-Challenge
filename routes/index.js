var express = require('express');
var router = express.Router();
var User = require('../db/User');
var path = require('path');

// GET home page
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = router;
