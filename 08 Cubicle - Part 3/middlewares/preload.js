const preloadCube = () => async (req, res, next) => {
  req.data = req.data || {};

  try {
    const cube = await req.storage.getProductById(req.params.id || req.params.productId);

    if (cube) {
      req.data.cube = cube;
    }
  } catch (err) {
    console.error('Database error>>>', err.message);
  }

  next();
};

module.exports = { preloadCube };
