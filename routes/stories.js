var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/top', function(req, res, next) {
  res.render('top');
});

router.get('/latest', function(req, res, next) {
  res.render('latest');
});

router.get('/new', function(req, res, next) {
  res.render('new');
});

router.get('/:id', function(req, res, next) {
  res.render('show');
});

router.get('/:id/edit', function(req, res, next) {
  res.render('edit');
});



module.exports = router;
