const mongoose = require('mongoose');

const snippetSchema = new mongoose.Schema({
  username: {
    type: String,
    lowercase: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  codeBody: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  lang: {
    type: String
  },
  tags: {
    type: Array
  }
});

const snippet = mongoose.model('snippet', snippetSchema);

module.exports = {
  snippet: snippet
};
