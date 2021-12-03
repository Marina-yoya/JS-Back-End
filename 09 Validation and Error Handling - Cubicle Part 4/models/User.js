const { Schema, model } = require('mongoose');

const schema = new Schema({
  hashedPassword: { type: String, required: true },
  username: { type: String, required: [true, 'Username is required!'], unique: true },
});

module.exports = model('User', schema);
