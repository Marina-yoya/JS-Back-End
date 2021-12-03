const { Schema, model } = require('mongoose');

const schema = new Schema({
  author: { type: String, required: true, maxLength: 50 },
  content: { type: String, required: true, maxLength: 250 },
});

module.exports = model('Comment', schema);
