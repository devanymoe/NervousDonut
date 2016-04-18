var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

function Stories() {
  return knex('stories');
}

function Users() {
  return knex('users');
}

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
  Stories().first().where('id', req.params.id).then(function(story) {
    Users().first('username').where('id', story.user_id).then(function(user) {
      res.render('stories/show', {
        story: story,
        user: user
      });
    });
  });
});

router.get('/:id/edit', function(req, res, next) {
  res.render('edit');
});



module.exports = router;
