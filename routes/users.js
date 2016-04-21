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
    res.render('users/index', {
      allUsers: user
    });
  });
})

router.get('/:username', function(req, res, next) {
  Users().first().where('username', req.params.username).then(function(thisUser) {
    if (req.user && thisUser.id === req.user.id) {
      Stories().select().where('user_id', thisUser.id).orderBy('created_at', 'desc').then(function(stories){
        res.render('users/show', {thisUser: thisUser, userStories: stories});
      })
    }
    else {
      Stories().select().where('published', true).andWhere('user_id', thisUser.id).orderBy('created_at', 'desc').then(function(publishedStories){
        res.render('users/show_published', {thisUser: thisUser, userStories: publishedStories});
      });
    };
  });
});



module.exports = router;
