const User = require('../models/User');

const createUser = async (username, email, hashedPassword) => {
	const user = new User({ username, email, hashedPassword });
	await user.save();

	return user;
};

const getUserById = async (id) => {
	return await User.findById(id).populate('reservations').lean();
};

const getUserByUsername = async (username) => {
	const pattern = new RegExp(`^${username}$`, 'i');
	return await User.findOne({ username: { $regex: pattern } });
};

const getUserByEmail = async (email) => {
	const pattern = new RegExp(`^${email}$`, 'i');
	return await User.findOne({ email: { $regex: pattern } });
};

module.exports = { createUser, getUserByUsername, getUserByEmail, getUserById };
