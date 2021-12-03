const { Schema, model } = require('mongoose');

const schema = new Schema({
  content: { type: String, required: true, maxLength: 250 },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true, maxLength: 50 },
});

module.exports = model('Comment', schema);
