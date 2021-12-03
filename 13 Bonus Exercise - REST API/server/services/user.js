const User = require('../models/User');

const findByEmail = (email) => {
	return User.findOne({ email });
};

const create = async (email, hashedPassword) => {
	const existing = await User.findOne({ email });
	if (existing) {
		const err = new Error('This email it taken.');
		err.status = 409;
		throw err;
	}
	const user = new User({ email, hashedPassword });
	await user.save();

	return user
};

module.exports = { findByEmail, create };
