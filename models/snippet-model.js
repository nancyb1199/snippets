const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  title: {
    type: String,
    required: true
  }
  body: {
    type: String,
    required: true
  }
  notes: {
    type: String
  }
  lang: {
    type: String
  }
  tags: {
    type: Array
  }
});
