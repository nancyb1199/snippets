const express = require('express');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Mustache = require('mustache');
var bodyParser = require('body-parser')

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

app.get('/', function(req, res) {
  if (!figure out if user is logged in) {
    res.render('index');
  } else {
    res.redirect('/user/');
  }
});

app.listen(3000, function() {
  console.log('Successfully started express application!');
});
