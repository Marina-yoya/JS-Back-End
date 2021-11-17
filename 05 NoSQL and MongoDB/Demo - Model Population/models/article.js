// const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, minlength: 10 },
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = model('Article', schema);
// module.exports = mongoose.model(('Articles', schema));
