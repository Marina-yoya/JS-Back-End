const { Schema, model } = require('mongoose');

const schema = new Schema({
	furniture: [{ type: Schema.Types.ObjectId, ref: 'Furniture' }],
	email: { type: String, required: [true, 'Email is required.'] },
	hashedPassword: { type: String, required: [true, 'Password is required.'] },
});

module.exports = model('User', schema);
