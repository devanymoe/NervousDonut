var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.locals.user);
  res.render('index', { title: 'Express', user: req.user });
});

module.exports = router;
