const fs = require('fs');
const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Mustache = require('mustache');
var bodyParser = require('body-parser');
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  session = require('express-session'),
  flash = require('express-flash-messages');
const bcrypt = require('bcryptjs');

// const hash = bcrypt.hashSync(password, 8);
const app = express();

const mongoURL = 'mongodb://localhost:27017/userSnippets';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(mongoURL, {
  useMongoClient: true
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('./public'));

const models = require("./models/user-model")
const User = models.User;
const modelsSnip = require("./models/snippet-model");
const snippet = modelsSnip.snippet;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.authenticate(username, password, function(err, user) {
      if (err) {
        return done(err)
      }
      if (user) {
        return done(null, user)
      } else {
        return done(null, false, {
          message: "There is no user with that username and password."
        })
      }
    })
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// yorkie's are the best dogs!
app.use(session({
  secret: 'yorkie dog',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// when a user logs in, show all of their existing snippets, if any
app.get('/user/', function(req, res) {
  // console.log("in app.get /user/");
  console.log(req.user.username);
  snippet.find({
    username: req.user.username
  }).then(function(snippet) {
    res.render('user', {
      snippet: snippet
    });
  })
});

app.get('/add/', function(req, res) {
  res.render('newsnip');
});
// make sure to save the currently logged in user with each snippet they
// create so we can use that later to search for various snippets I own
app.post('/add/', function(req, res) {
  console.log(req.body);
  console.log(req.user);
  snippet.create({
    username: req.user.username,
    title: req.body.title,
    codeBody: req.body.codeBody,
    notes: req.body.notes,
    lang: req.body.lang,
    tags: req.body.tags
  });
  res.redirect('/user/');
});



app.get('/register/', function(req, res) {
  res.render('register');

});

app.post('/register', function(req, res) {
  console.log(req.body);
  User.create(req.body)
    .then(function(user) {
      res.redirect('/');
    })
});

// render an individual snippet selected from the user page
app.get('/:id/', function(req, res) {
  console.log(req.params.id);
  snippet.findOne({
    _id: req.params.id
  }).then(function(snippet) {
    res.render('snip', {
      snippet: snippet
    });
  });
});

// search for snippets by language or tag
app.post('/search/', function(req, res) {
  // if the language search was used:
  if (req.body.srchlang) {
    snippet.find({
        username: req.user.username,
        lang: req.body.srchlang
      })
      .then(function(snippet) {
          res.render('results', {
            snippet: snippet
          });
        })
  } else {
    // if the tag search was used:
    // thanks to this StackOverflow for showing me the regex that made this work!
    // https://stackoverflow.com/questions/26814456/how-to-get-all-the-values-that-contains-part-of-a-string-using-mongoose-find
    snippet.find({
        username: req.user.username,
        tags: { "$regex": req.body.srchtag, "$options": "i" }
      })
      .then(function(snippet) {
        res.render('results', {
          snippet: snippet
        });
      })
  }
});


app.get('/', function(req, res) {
  if (!req.user) {
  res.render('index', {
    messages: res.locals.getMessages()
  });
   } else {
  res.redirect('/user/');
  }
});

app.post('/', passport.authenticate('local', {
  successRedirect: '/user/',
  failureRedirect: '/',
  failureFlash: true
}));

module.exports = app;

app.listen(3000, function() {
  console.log('Successfully started express application!');
});
