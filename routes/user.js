var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  res.render('user');
});


module.exports = router;
