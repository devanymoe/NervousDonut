var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');

function Users(){
  return knex('users')
}
function Stories(){
  return knex('stories')
}
/* GET users listing. */
router.get('/:username', function(req, res, next) {
  Users().first().where('username', req.params.username).then(function(user){
    Stories().select().where('user_id', user.id).then(function(stories){
      res.render('user', {user: user, userStories: stories})
    })
  })

});


module.exports = router;
