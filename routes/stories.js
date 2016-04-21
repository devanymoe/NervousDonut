var express = require('express');
var router = express.Router();
var validations = require('../lib/validations');
var knex = require('../db/knex');
var rp = require('request-promise');

var checkLoggedIn = function(req, res, next) {
  if (!req.user) {
    res.redirect('/');
  }
  else {
    next();
  }
};

var checkAuthor = function(req, res, next) {
  knex('stories').first().where('id', req.params.id).then(function(story) {
    if (req.user.id !== story.user_id) {
      res.redirect('/');
    }
    else {
      next();
    }
  });
};

function Stories() {
  return knex('stories');
}

function Users() {
  return knex('users');
}

router.get('/', function(req, res, next) {
  Stories().select('stories.id AS story_id', 'user_id', 'title', 'image_1', 'image_2', 'image_3', 'text', 'created_at', 'updated_at', 'likes', 'published', 'email', 'username', 'first_name', 'last_name', 'superuser', 'googleId').where('published', true).innerJoin('users', 'stories.user_id', 'users.id').orderBy('created_at', 'desc').limit(2).then(function(latestStories) {
    Stories().select('stories.id AS story_id', 'user_id', 'title', 'image_1', 'image_2', 'image_3', 'text', 'created_at', 'updated_at', 'likes', 'published', 'email', 'username', 'first_name', 'last_name', 'superuser', 'googleId').where('published', true).innerJoin('users', 'stories.user_id', 'users.id').orderBy('likes', 'desc').limit(2).then(function(topStories) {
      res.render('stories/index', {
        latestStories: latestStories,
        topStories: topStories
      });
    });
  });
});

router.get('/new', checkLoggedIn, function(req, res, next) {
  var imageUrl = 'https://api.unsplash.com/photos/random?client_id=' + process.env.app_id;

  Promise.all([
    rp({uri: imageUrl, json: true}),
    rp({uri: imageUrl, json: true}),
    rp({uri: imageUrl, json: true})
  ]).then(function(images) {
    res.render('stories/new', {
      image1: images[0],
      image2: images[1],
      image3: images[2]
    });
  }).catch(function(err) {
    console.log(err);
  });
});

router.get('/top', function(req, res, next) {
  Stories().select('stories.id AS story_id', 'user_id', 'title', 'image_1', 'image_2', 'image_3', 'text', 'created_at', 'updated_at', 'likes', 'published', 'email', 'username', 'first_name', 'last_name', 'superuser', 'googleId').where('published', true).innerJoin('users', 'stories.user_id', 'users.id').orderBy('likes', 'desc').then(function(topStories) {
    res.render('stories/top', {
      topStories: topStories
    });
  });
});

router.get('/latest', function(req, res, next) {
  Stories().select('stories.id AS story_id', 'user_id', 'title', 'image_1', 'image_2', 'image_3', 'text', 'created_at', 'updated_at', 'likes', 'published', 'email', 'username', 'first_name', 'last_name', 'superuser', 'googleId').where('published', true).innerJoin('users', 'stories.user_id', 'users.id').orderBy('created_at', 'desc').then(function(latestStories) {
    res.render('stories/latest', {
      latestStories: latestStories
    });
  });
});

router.get('/new/save', checkLoggedIn, function(req, res, next) {
  res.render('stories');
});

router.post('/new/save', checkLoggedIn, function(req, res, next) {
  var d = new Date();
  var isoDate = d.toISOString();
  var errors = [];

  errors.push(validations.titleIsNotBlank(req.body.title));
  errors.push(validations.storyIsNotBlank(req.body.text));

  for(var i = 0; i < errors.length; i++) {
    if(errors[i] === '') {
      errors.splice(i, 1);
      i--;
    }
  }

  if (errors.length) {
    res.render('stories/new', {
      title: req.body.title,
      text: req.body.text,
      existingImage_1: req.body.image_1,
      existingImage_2: req.body.image_2,
      existingImage_3: req.body.image_3,
      message: errors
    });
    return;
  }
  else {
    Stories().insert({
      title: req.body.title,
      created_at: isoDate,
      updated_at: isoDate,
      image_1: req.body.image_1,
      image_2: req.body.image_2,
      image_3: req.body.image_3,
      text: req.body.text,
      user_id: req.user.id,
      likes: 0,
      published: false
    }).then(function(){
      res.redirect('/stories')
    })
  }
})

router.post('/new/publish', checkLoggedIn, function(req, res, next) {
  var d = new Date();
  var isoDate = d.toISOString();
  var errors = [];

  errors.push(validations.titleIsNotBlank(req.body.title));
  errors.push(validations.storyIsNotBlank(req.body.text));

  for(var i = 0; i < errors.length; i++) {
    if(errors[i] === '') {
      errors.splice(i, 1);
      i--;
    }
  }

  if (errors.length) {
    res.render('stories/new', {
      title: req.body.title,
      text: req.body.text,
      existingImage_1: req.body.image_1,
      existingImage_2: req.body.image_2,
      existingImage_3: req.body.image_3,
      message: errors
    });
    return;
  }
  else {
    Stories().insert({
      title: req.body.title,
      created_at: isoDate,
      updated_at: isoDate,
      image_1: req.body.image_1,
      image_2: req.body.image_2,
      image_3: req.body.image_3,
      text: req.body.text,
      user_id: req.user.id,
      likes: 0,
      published: true
    }, '*').then(function(newStory){
      res.redirect('/stories/' + newStory[0].id)
    })
  }
});

router.put('/:id/edit/save', checkLoggedIn, checkAuthor, function(req, res, next) {
  var d = new Date();
  var isoDate = d.toISOString();
  var errors = [];

  errors.push(validations.titleIsNotBlank(req.body.title));
  errors.push(validations.storyIsNotBlank(req.body.text));

  for(var i = 0; i < errors.length; i++) {
    if(errors[i] === '') {
      errors.splice(i, 1);
      i--;
    }
  }

  if (errors.length) {
    Stories().first().where('id', req.params.id).then(function(story){
      res.render('stories/edit', {
        story: story,
        title: req.body.title,
        text: req.body.text,
        message: errors
      });
    })
    return;
  }
  else {
    Stories().pluck('created_at').where('id', req.params.id).then(function(createdAt) {
      Stories().where({id: req.params.id}).update({
        title: req.body.title,
        created_at: createdAt[0],
        updated_at: isoDate,
        image_1: req.body.image_1,
        image_2: req.body.image_2,
        image_3: req.body.image_3,
        text: req.body.text,
        user_id: req.body.user_id,
        likes: req.body.likes,
        published: false
      }).then(function(){
        res.redirect('/stories');
      });
    });
  }
});

router.put('/:id/edit/publish', checkLoggedIn, checkAuthor, function(req, res, next) {
  var d = new Date();
  var isoDate = d.toISOString();
  var errors = [];

  errors.push(validations.titleIsNotBlank(req.body.title));
  errors.push(validations.storyIsNotBlank(req.body.text));

  for(var i = 0; i < errors.length; i++) {
    if(errors[i] === '') {
      errors.splice(i, 1);
      i--;
    }
  }

  if (errors.length) {
    Stories().first().where('id', req.params.id).then(function(story){
      res.render('stories/edit', {
        story: story,
        title: req.body.title,
        text: req.body.text,
        message: errors
      });
    })
    return;
  }
  else {
    Stories().pluck('created_at').where('id', req.params.id).then(function(createdAt) {
      Stories().where({id: req.params.id}).update({
        title: req.body.title,
        created_at: createdAt[0],
        updated_at: isoDate,
        image_1: req.body.image_1,
        image_2: req.body.image_2,
        image_3: req.body.image_3,
        text: req.body.text,
        user_id: req.user.id,
        likes: req.body.likes,
        published: true
      }).then(function(){
        res.redirect('/stories');
      });
    });
  }
});

router.get('/:id', function(req, res, next) {
  Stories().first().where('id', req.params.id).then(function(story) {
    Users().first('username', 'id').where('id', story.user_id).then(function(thisUser) {
      if ((story.published === false) && !req.user) {
        res.redirect('/')
      }
      else if ((story.published === false) && (req.user.id !== story.user_id)){
        res.redirect('/')
      }
      else {
        res.render('stories/show', {
          story: story,
          thisUser: thisUser
        });
      }
    });
  });
});

router.get('/:id/edit', checkLoggedIn, checkAuthor, function(req, res, next) {
  Stories().first().where('id', req.params.id).then(function(story){
    res.render('stories/edit', {
      story: story
    });
  });
});

module.exports = router;
