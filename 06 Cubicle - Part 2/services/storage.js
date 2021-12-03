const Cube = require('../models/Cube'),
  Comment = require('../models/Comment'),
  Accessory = require('../models/Accessory');

const init = async () => {
  return (req, res, next) => {
    req.storage = {
      editCube,
      createCube,
      deleteCube,
      getAllCubes,
      getCubeById,
      createComment,
      createAccessory,
      attachAccessory,
      getAllAccessories,
    };
    next();
  };
};

// Cubes
const getAllCubes = async (query) => {
  const searchParams = {
    name: new RegExp(query.search, 'i'),
    difficulty: { $gte: Number(query.from) || 0, $lte: Number(query.to) || 6 },
  };

  const records = await Cube.find(searchParams).lean();

  if (records.length === 0 && Object.keys(query).length) {
    records.push({ emptySearchResult: true });
    // In case of no result by a search query
  }
  return records;
};

const createCube = async (data) => {
  return new Cube(data).save();
};

const getCubeById = async (id) => {
  const record = await Cube.findById(id).populate('comments').populate('accessories').lean();
  return record ? record : undefined;
  // 'findById' throws exception combined with 'lean' if there is
  // no results in the collection instead of null as it does without using lean!
  // Same issue is not present with the method 'find'.
};

const editCube = async (id, data) => {
  const record = await Cube.findById(id);

  if (record === null) {
    throw new ReferenceError('No such ID in database!');
  }

  Object.assign(record, data);
  return record.save();
};

const deleteCube = async (id) => {
  return Cube.findByIdAndDelete(id);
};

// Comments
const createComment = async (cubeId, data) => {
  const cubeRecord = await Cube.findById(cubeId);

  if (cubeRecord === null) {
    throw new ReferenceError('No such ID in database!');
  }

  const commentRecord = new Comment(data);
  await commentRecord.save();

  cubeRecord.comments.push(commentRecord);
  return cubeRecord.save();
};

// Accessories
const getAllAccessories = async (existingAccessories) => {
  return Accessory.find({ _id: { $nin: existingAccessories } }).lean();
};

const createAccessory = async (data) => {
  return new Accessory(data).save();
};

const attachAccessory = async (cubeId, accessoryId) => {
  const cubeRecord = await Cube.findById(cubeId);
  const accessoryRecord = await Accessory.findById(accessoryId);

  if (cubeRecord === null || accessoryRecord === null) {
    throw new ReferenceError('No such ID in database!');
  }

  cubeRecord.accessories.push(accessoryRecord);
  return cubeRecord.save();
};

module.exports = {
  init,
  editCube,
  createCube,
  deleteCube,
  getAllCubes,
  getCubeById,
  createComment,
  createAccessory,
  attachAccessory,
  getAllAccessories,
};
