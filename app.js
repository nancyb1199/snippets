const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Mustache = require('mustache');
var bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync(password, 8);

const mongoURL = 'mongodb://localhost:27017/cookbooks';
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(mongoURL, {
  useMongoClient: true
});

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}))
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('./public'));

const user = require("./models/user-model");
const snippet = require("./models/snippet-model");

app.get('/user/', function(req, res) {
  res.render('user');
});

app.get('/add/', function(req, res) {
  res.render('newsnip');
});

app.post('/add/', function(req, res) {
  // save new snippet to the db & send back to /user/
});

app.get('/:id/', function(req, res) {
  res.render('snip');
});

app.get('/', function(req, res) {
  // if (!user is logged in) {
    // res.render('index');
  // } else {
    res.redirect('/user/');
  // }
});

app.listen(3000, function() {
  console.log('Successfully started express application!');
});
