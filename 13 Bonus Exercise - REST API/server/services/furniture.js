const Furniture = require('../models/Furniture');

const getAll = () => {
	return Furniture.find({});
};

const getById = (id) => {
	return Furniture.findById(id);
};

const create = async (data) => {
	const record = new Furniture(data);
	await record.save();
	return record;
};

const update = async (record, data) => {
	Object.assign(record, data);
	await record.save();

	return record;
};

const remove = (id) => {
	return Furniture.findByIdAndDelete(id);
};

module.exports = { getAll, getById, create, update, remove };
