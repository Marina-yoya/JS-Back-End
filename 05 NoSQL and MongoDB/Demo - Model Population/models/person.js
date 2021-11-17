// const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const schema = new Schema({
  age: Number,
  name: String,
  gender: String,
});

module.exports = model('Person', schema);
// module.exports = mongoose.model(('Articles', schema));
