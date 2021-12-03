const Comment = require('../models/Comment'),
  Cube = require('../models/Cube');

const create = async (cubeId, comment) => {
  const cubeRecord = await Cube.findById(cubeId);

  if (cubeRecord === null) {
    throw new ReferenceError('No such ID in database!');
  }

  const commentRecord = new Comment(comment);
  await commentRecord.save();

  cubeRecord.comments.push(commentRecord);
  return cubeRecord.save();
};

module.exports = { create };
