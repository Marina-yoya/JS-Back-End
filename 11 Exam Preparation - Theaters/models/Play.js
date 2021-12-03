const { Schema, model } = require('mongoose');

const schema = new Schema({
	title: { type: String, required: true },
	public: { type: Boolean, default: false },
	imageUrl: { type: String, required: true },
	createdAt: { type: Date, default: Date.now },
	description: { type: String, required: true, maxLength: 50 },
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	userLikes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
});

module.exports = model('Play', schema);
