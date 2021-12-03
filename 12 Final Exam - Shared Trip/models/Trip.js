const { Schema, model } = require('mongoose');

const schema = new Schema({
	startPoint: { type: String, required: true },
	endPoint: { type: String, required: true },

	date: { type: String, required: true },
	time: { type: String, required: true },

	seats: { type: Number, required: true },
	price: { type: Number, required: true },
	description: { type: String, required: true },

	vehicleBrand: { type: String, required: true },
	imageUrl: { type: String, required: true },

	author: { type: Schema.Types.ObjectId, ref: 'User' },
	companions: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
});

module.exports = model('Trip', schema);
