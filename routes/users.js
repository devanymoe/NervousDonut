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
  console.log(req.user.username);
  Users().first().where('username', req.params.username).then(function(user) {
    if (user.id === req.user.id) {
      Stories().select().where('user_id', user.id).orderBy('created_at', 'desc').then(function(stories){
        res.render('user', {user: user, userStories: stories});
      })
    }
    else {
      Stories().select().where('published', true).andWhere('user_id', user.id).orderBy('created_at', 'desc').then(function(publishedStories){
        res.render('user_published', {user:user, userStories: publishedStories});
      });
    };
  });
});




router.get('/allusers', function(req, res, next) {
  Users().select().then(function(data) {
    console.log(data);
  });
});



module.exports = router;
