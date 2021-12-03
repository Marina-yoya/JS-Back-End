const User = require('../models/User');

const createUser = async (gender, photo, email, hashedPassword) => {
	const user = new User({ gender, photo, email, hashedPassword });
	await user.save();

	return user;
};

const getUserById = async (id) => {
	return await User.findById(id).populate('trips').lean();
};

const getUserByEmail = async (email) => {
	const pattern = new RegExp(`^${email}$`, 'i');
	return await User.findOne({ email: { $regex: pattern } });
};

module.exports = { createUser, getUserByEmail, getUserById };
