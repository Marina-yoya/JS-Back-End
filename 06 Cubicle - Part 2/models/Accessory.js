const { Schema, model } = require('mongoose');

const schema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  description: { type: String, required: true, maxLength: 500 },
  imageUrl: { type: String, required: true, maxLength: 400, match: new RegExp(/^https?:\/\//) },
});

module.exports = model('Accessory', schema);
