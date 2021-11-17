// const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const schema = new Schema({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  article: { type: Schema.Types.ObjectId, ref: 'Article' },
});

module.exports = model('Comment', schema);
// module.exports = mongoose.model(('Articles', schema));
