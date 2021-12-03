const { Schema, model } = require('mongoose');

const schema = new Schema({
  content: {
    type: String,
    required: [true, "You can't publish an empty comment!"],
    maxLength: [250, 'Comment must be less than 250 characters!'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required!'],
    maxLength: [50, 'Author name must be less than 50 characters!'],
  },
});

module.exports = model('Comment', schema);
