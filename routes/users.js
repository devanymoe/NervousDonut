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

router.get('/allusers', function(req, res, next) {
  Users().select().orderBy('username', 'asc').then(function(user) {
    res.render('user/allusers', {
      allUsers: user
    });
  });
})

router.get('/:username', function(req, res, next) {
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



module.exports = router;
