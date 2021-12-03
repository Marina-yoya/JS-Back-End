const Accessory = require('../models/Accessory');

const getAll = async (existingAccessories) => {
  return Accessory.find({ _id: { $nin: existingAccessories } }).lean();
};

const create = async (data) => {
  return new Accessory(data).save();
};

module.exports = { getAll, create };
