var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var knex = require ('./db/knex');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var passport = require('passport');


var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var stories = require('./routes/stories');

var app = express();
require('dotenv').load();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  knex('users').first().where('id', user.id)
    .then(function (user) {
      console.log('deserialize', user);
      done(null, user);
    })
    .catch(function (err) {
      done(err);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ['email', 'profile'],
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    knex('users').first().where('googleId', profile.id).then(function(user) {
      if (!user) {
        var email = profile.emails[0].value;
        var username = email.split('@')[0];
        knex('users').insert({
          email: profile.emails[0].value,
          username: username,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          superuser: false,
          googleId: profile.id
        }, '*').then(function(user) {
          console.log('new user', user);
          done(null, user);
        });
      }
      else {
        console.log('old user', user);
        done(null, user);
      }
    });
  }
));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-method-override')());
app.use(session({
  name: 'session',
  keys: [process.env.SESSION_KEY]
}));
app.use(passport.initialize());
app.use(passport.session());


require('dotenv').load();
knex.migrate.latest();

app.use(function (req, res, next) {
  console.log(req.user);
  res.locals.user = req.user
  // console.log(req.user);
  // console.log(res.locals.user);
  // console.log(req.session.user);
  // console.log(req.session);
  next()
})

app.use('/', routes);
app.use('/', auth);
app.use('/stories', stories);
app.use('/users', users);

app.get('/auth/google', passport.authenticate('google'));

// app.get('/auth/google',
//   passport.authenticate('google', { scope:
//   	[ 'https://www.googleapis.com/auth/plus.login',
//   	, 'https://www.googleapis.com/auth/plus.profile' ] }
// ));

app.get( '/auth/google/callback',
	passport.authenticate( 'google', {
		successRedirect: '/',
		failureRedirect: '/error'
}));

app.get('/logout', function(req, res){
  req.logOut();
  req.session = null;
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
