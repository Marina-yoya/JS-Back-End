const parseMongooseError = (err) => {
  return Object.values(err.errors).map((e) => e.properties.message);
};

module.exports = { parseMongooseError };
