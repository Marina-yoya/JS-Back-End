const User = require('../models/User');

const getUserByUsername = async (username) => {
  const pattern = new Regexp(`^${username.trim()}$`, 'i')
  return await User.findOne({ username: { $regex: pattern } });
};

const createUser = async (data) => {
  const user = new User(data);

  await user.save();
  return user;
};

module.exports = { getUserByUsername, createUser };
