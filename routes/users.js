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
    Stories().select().where('user_id', user.id).orderBy('created_at', 'desc').then(function(stories){
      res.render('user', {user: user, userStories: stories})
    })
  })

router.get('/allusers', function(req, res, next) {
  Users().select().then(function(data) {
    console.log(data);
  });
});


});


module.exports = router;
