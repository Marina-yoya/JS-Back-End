const Cube = require('../models/Cube'),
  Accessory = require('../models/Accessory');

const getAll = async (query) => {
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

const getById = async (id) => {
  const record = await Cube.findById(id)
    .populate('accessories')
    .populate('owner')
    .populate({
      path: 'comments',
      populate: { path: 'author' },
    })
    .lean();

  if (record) {
    const viewModel = {
      _id: record._id,
      name: record.name,
      imageUrl: record.imageUrl,
      ownerId: record.owner ? record.owner._id : null, // Database migration haven't been done, so missing owner is expected
      difficulty: record.difficulty,
      accessories: record.accessories,
      description: record.description,
      owner: record.owner ? record.owner.username : 'Anonymous', // Database migration haven't been done, so missing owner is expected
      comments: record.comments.map((c) => ({ content: c.content, author: c.author.username })),
    };

    return viewModel;
  }

  return undefined;
  // 'findById' throws exception combined with 'lean' if there is
  // no results in the collection instead of null as it does without using lean!
  // Same issue is not present with the method 'find'.
};

const create = async (data) => {
  return new Cube(data).save();
};

const edit = async (id, data) => {
  const record = await Cube.findById(id);

  if (record === null) {
    throw new ReferenceError('No such ID in database!');
  }

  Object.assign(record, data);
  return record.save();
};

const del = async (id) => {
  return Cube.findByIdAndDelete(id);
};

// Attach accessory
const attach = async (cubeId, accessoryId) => {
  try {
    const cubeRecord = await Cube.findById(cubeId);
    const accessoryRecord = await Accessory.findById(accessoryId);

    if (cubeRecord === null || accessoryRecord === null) {
      throw new ReferenceError('No such ID in database!');
    }

    cubeRecord.accessories.push(accessoryRecord);
    return cubeRecord.save();
  } catch (err) {
    console.error(err.message);
    res.redirect('/404')
  }
};

module.exports = { getAll, getById, attach, create, edit, del };
