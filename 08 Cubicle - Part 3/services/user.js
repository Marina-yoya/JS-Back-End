const User = require('../models/User');

const getUserByUsername = async (username) => {
  return await User.findOne({ username: { $regex: username.trim(), $options: 'i' } });
};

const createUser = async (data) => {
  const user = new User(data);

  await user.save();
  return user;
};

module.exports = { getUserByUsername, createUser };
