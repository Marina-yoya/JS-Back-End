const { Schema, model } = require('mongoose');

const schema = new Schema({
  // In real situation the username
  // will be required to be unique of course.
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
});

module.exports = model('User', schema);
