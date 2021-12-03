const { Schema, model } = require('mongoose');

const schema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, maxLength: 50 },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  difficulty: { type: Number, required: true, min: 1, max: 6 },
  description: { type: String, required: true, maxLength: 500 },
  accessories: [{ type: Schema.Types.ObjectId, ref: 'Accessory' }],
  imageUrl: { type: String, required: true, maxLength: 400, match: new RegExp(/^https?:\/\//) },
});

module.exports = model('Cube', schema);
