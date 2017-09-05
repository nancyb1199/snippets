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
const Snippet = require("./models/snippet-model");

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

app.use(session({
    secret: 'yorkie dog',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/user/', function(req, res) {
  console.log("in app.get /user/");
  res.render('user');
});

app.get('/add/', function(req, res) {
  res.render('newsnip');
});

app.post('/add/', function(req, res) {
  // save new snippet to the db & send back to /user/?
  // or maybe leave here with option to add another?
});



app.get('/register/', function(req, res) {
  res.render('register');

});

app.post('/register', function(req, res) {
  console.log(req.body);
  User.create(req.body)
  .then(function(user) {
    res.redirect('/');
    }
  )
});

app.get('/:id/', function(req, res) {
  // res.render('snip');
});

app.get('/', function(req, res) {
  // if (!user is logged in) {
    res.render('index', {
        messages: res.locals.getMessages()
    });
  // } else {
    // res.redirect('/user/');
  // }
});

app.post('/', passport.authenticate('local', {
	successRedirect: '/user/',
	failureRedirect: '/register/',
   failureFlash: true
}));

module.exports = app;

app.listen(3000, function() {
  console.log('Successfully started express application!');
});
