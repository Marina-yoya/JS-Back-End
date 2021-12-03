const { Schema, model } = require('mongoose');

const schema = new Schema({
	email: { type: String, required: true },
	username: { type: String, required: true },
	hashedPassword: { type: String, required: true },
	reservations: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
	offeringHotels: [{ type: Schema.Types.ObjectId, ref: 'Hotel' }],
});

module.exports = model('User', schema);
