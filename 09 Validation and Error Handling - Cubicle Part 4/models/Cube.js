const { Schema, model } = require('mongoose');

const IMAGE_PATTERN = /^https?:\/\//;
const TEXT_PATTERN = /^[a-zA-Z0-9 ]+$/;

const schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  accessories: [{ type: Schema.Types.ObjectId, ref: 'Accessory' }],

  name: {
    type: String,
    required: [true, 'Cube name is required!'],
    minLength: [5, 'Cube name must be at least 5 characters long!'],
    maxLength: [50, 'Cube name must be less than 50 characters!'],
    match: [TEXT_PATTERN, 'Cube name must contain only latin alphanumeric characters!'],
  },
  description: {
    type: String,
    required: [true, 'Description is required!'],
    minLength: [20, 'Description must be at least 20 characters long!'],
    maxLength: [500, 'Description must be less than 500 characters!'],
    match: [TEXT_PATTERN, 'Description must be only latin alphanumeric characters!'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image is required!'],
    match: [IMAGE_PATTERN, 'Image must be a valid URL!'],
  },
  difficulty: {
    type: Number,
    required: [true, 'Difficulty level is required!'],
    min: [1, 'Difficulty level must be between 1 and 6!'],
    max: [6, 'Difficulty level must be between 1 and 6!'],
  },
});

module.exports = model('Cube', schema);
