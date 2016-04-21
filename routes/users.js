var express = require('express');
var router = express.Router();
var knex = require('../db/knex.js');
var _ = require('underscore');

function Users(){
  return knex('users')
}
function Stories(){
  return knex('stories')
}

function JoinedTable() {
  return knex('user_stories')
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  Users().select().then(function(getusers) {
    Users().innerJoin('stories', 'users.id', 'stories.user_id').select().then(function(getstories) {
        for (var i = 0; i < getusers.length; i++ ) {
          var user = getusers[i];

          user.stories = _.filter(getstories, function(story) {
            return story.user_id === user.id && story.published === true;
          });

          user.size = _.size(user.stories);
          console.log(user.size);

        }
        res.render('users/index', {
          allUsers: getusers,
      });
    });
  });
})

router.get('/:username', function(req, res, next) {
  Users().first().where('username', req.params.username).then(function(thisUser) {
    if (req.user && thisUser.id === req.user.id) {
      Stories().select().where('user_id', thisUser.id).orderBy('created_at', 'desc').then(function(stories){
        res.render('users/show', {
          thisUser: thisUser,
          userStories: stories,
          owner: true
        });
      })
    }
    else {
      Stories().select().where('published', true).andWhere('user_id', thisUser.id).orderBy('created_at', 'desc').then(function(publishedStories){
        res.render('users/show', {
          thisUser: thisUser,
          userStories: publishedStories
        });
      });
    };
  });
});



module.exports = router;
