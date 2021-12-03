const User = require('../models/User');

const createUser = async (username, hashedPassword) => {
	const user = new User({ username, hashedPassword });
	await user.save();

	return user;
};

const getUserById = async (id) => {
	return await User.findById(id)
};

const getUserByUsername = async (username) => {
	const pattern = new RegExp(`^${username}$`, 'i');
	return await User.findOne({ username: { $regex: pattern } });
};

module.exports = { createUser, getUserByUsername, getUserById };
