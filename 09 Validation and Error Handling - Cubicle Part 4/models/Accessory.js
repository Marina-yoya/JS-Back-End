const { Schema, model } = require('mongoose');

const IMAGE_PATTERN = /^https?:\/\//;

const schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    maxLength: [50, 'Name must be less than 50 characters long!'],
  },
  description: {
    type: String,
    required: [true, 'Description is required!'],
    maxLength: [500, 'Description must be less than 500 characters long!'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image is required!'],
    match: [IMAGE_PATTERN, 'Image must be a valid URL!'],
  },
});

module.exports = model('Accessory', schema);
