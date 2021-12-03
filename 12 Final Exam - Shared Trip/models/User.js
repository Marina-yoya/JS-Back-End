const { Schema, model } = require('mongoose');

const schema = new Schema({
	photo: { type: String, required: true },
	email: { type: String, required: true },
	gender: { type: String, required: true },
	hashedPassword: { type: String, required: true },

	// Contains added trips by user
	trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
});

module.exports = model('User', schema);