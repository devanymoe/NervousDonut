var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var rp = require('request-promise');

function Stories() {
  return knex('stories');
}

function Users() {
  return knex('users');
}

router.get('/', function(req, res, next) {
  res.render('stories/index');
});

router.get('/new', function(req, res, next) {
  var image1;
  var image2;
  var image3;
  rp({uri: 'https://api.unsplash.com/photos/random?client_id=' + process.env.app_id})
    .then(function(data) {
      image1 = JSON.parse(data);
      rp({uri: 'https://api.unsplash.com/photos/random?client_id=' + process.env.app_id})
        .then(function(data2) {
          image2 = JSON.parse(data2);
          rp({uri: 'https://api.unsplash.com/photos/random?client_id=' + process.env.app_id})
            .then(function(data3) {
              image3 = JSON.parse(data3);
              res.render('stories/new', {
                image1: image1,
                image2: image2,
                image3: image3
              })
            })
            .catch(function(err) {
              console.log(err);
            });
        })
        .catch(function(err) {
          console.log(err);
        });
    })
    .catch(function(err) {
      console.log(err);
    });
})

router.get('/top', function(req, res, next) {
  Stories().select().innerJoin('users', 'stories.user_id', 'users.id').orderBy('likes', 'desc').then(function(topStories) {
    res.render('stories/top', {
      topStories: topStories
    });
  });
});

router.get('/latest', function(req, res, next) {
  Stories().select().innerJoin('users', 'stories.user_id', 'users.id').orderBy('created_at', 'desc').then(function(latestStories) {
    res.render('stories/latest', {
      latestStories: latestStories
    });
  });
});

router.get('/new/save', function(req, res, next) {
  res.render('stories');
});

router.get('/new', function(req, res, next) {
  res.render('new');
});

router.post('/new/save', function(req, res, next) {
  var d = new Date();
  var isoDate = d.toISOString();
  Stories().insert({
    title: req.body.title,
    created_at: isoDate,
    updated_at: isoDate,
    image_1: req.body.image_1,
    image_2: req.body.image_2,
    image_3: req.body.image_3,
    text: req.body.text,
    user_id: 1,
    likes: 0,
    published: false
  }).then(function(){
    res.redirect('/stories')
  })
});

router.post('/new/publish', function(req, res, next) {
  var d = new Date();
  var isoDate = d.toISOString();
  Stories().insert({
    title: req.body.title,
    created_at: isoDate,
    updated_at: isoDate,
    image_1: req.body.image_1,
    image_2: req.body.image_2,
    image_3: req.body.image_3,
    text: req.body.text,
    user_id: 1,
    likes: 0,
    published: true
  }, '*').then(function(newStory){
    res.redirect('/stories/' + newStory[0].id)
  })
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
