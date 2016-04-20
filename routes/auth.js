var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/logout', function(req, res, next) {
  res.render('index', { title: 'Express', user: null });
});

module.exports = router;
