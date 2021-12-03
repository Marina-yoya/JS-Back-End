const router = require('express').Router(),
  asyncWrapper = require('../util/asyncWrapper'),
  { parseMongooseError } = require('../util/parse'),
  { preloadCube } = require('../middlewares/preload'),
  { isAuth, isOwner } = require('../middlewares/guards');

// Get all
router.get(
  '/',
  asyncWrapper(async (req, res) => {
    try {
      const ctx = {
        title: 'Cubicle',
        to: req.query.to || '',
        from: req.query.from || '',
        search: req.query.search || '',
        cubes: await req.storage.getAllProducts(req.query),
      };

      res.render('products', ctx);
    } catch (err) {
      res.redirect('/404');
    }
  })
);

// Create
router.get('/create', isAuth(), (req, res) => {
  res.render('createProduct', { title: 'Create' });
});

router.post(
  '/create',
  isAuth(),
  asyncWrapper(async (req, res) => {
    const cube = {
      name: req.body.name.trim(),
      owner: req.user._id.trim(),
      imageUrl: req.body.imageUrl.trim(),
      description: req.body.description.trim(),
      difficulty: req.body.difficulty ? Number(req.body.difficulty) : req.body.difficulty,
    };

    // For the right option to be preselect
    cube[`select${cube.difficulty}`] = true;

    try {
      await req.storage.createProduct(cube);
      res.redirect('/');
    } catch (err) {
      const ctx = { cube, title: 'Create' };

      // For the right option to be preselect
      ctx.cube[`select${cube.difficulty}`] = true;

      err.name === 'ValidationError' ? (ctx.errors = parseMongooseError(err)) : (ctx.errors = [err.message]);

      res.render('createProduct', ctx);
    }
  })
);

// Edit
router.get('/edit/:id', preloadCube(), isOwner(), (req, res) => {
  const ctx = {
    title: 'Edit',
    cube: req.data.cube,
  };

  if (ctx.cube === undefined) {
    return res.redirect('/404');
  }

  // For the right option to be preselect
  ctx.cube[`select${ctx.cube.difficulty}`] = true;

  res.render('editProduct', ctx);
});

router.post(
  '/edit/:id',
  preloadCube(),
  isOwner(),
  asyncWrapper(async (req, res) => {
    const id = req.params.id;

    const cube = {
      _id: id,
      name: req.body.name.trim(),
      imageUrl: req.body.imageUrl.trim(),
      description: req.body.description.trim(),
      difficulty: Number(req.body.difficulty),
    };

    try {
      await req.storage.editProduct(id, cube);
      res.redirect('/');
    } catch (err) {
      const ctx = { cube, title: 'Edit' };

      err.name === 'ValidationError' ? (ctx.errors = parseMongooseError(err)) : (ctx.errors = [err.message]);

      res.render('editProduct', ctx);
    }
  })
);

// Details
router.get('/details/:id', preloadCube(), (req, res) => {
  const cube = req.data.cube;
  if (cube === undefined) res.redirect('/404');

  cube.isUser = req.user;
  cube.isOwner = req.user && cube.ownerId == req.user._id;
  const ctx = { cube: cube, title: 'Cube Details' };

  res.render('productDetails', ctx);
});

// Delete
router.get('/delete/:id', preloadCube(), isOwner(), (req, res) => {
  const ctx = {
    title: 'Delete',
    cube: req.data.cube,
  };

  if (ctx.cube === undefined) {
    return res.redirect('/404');
  }

  // For the right option to be preselect
  ctx.cube[`select${ctx.cube.difficulty}`] = true;

  res.render('deleteProduct', ctx);
});

router.post(
  '/delete/:id',
  preloadCube(),
  isOwner(),
  asyncWrapper(async (req, res) => {
    try {
      await req.storage.deleteProduct(req.params.id);
      res.redirect('/');
    } catch (err) {
      res.redirect('/404');
    }
  })
);

// Attach accessory
router.get(
  '/attach/:productId',
  preloadCube(),
  isOwner(),
  asyncWrapper(async (req, res) => {
    try {
      const cube = req.data.cube;
      const accessories = await req.storage.getAllAccessories(cube.accessories.map((c) => c._id));

      const ctx = {
        title: 'Attach accessories',
        cube: cube,
        accessories: accessories,
      };

      if (ctx.cube === undefined) {
        throw new Error();
      }

      res.render('attachAccessory', ctx);
    } catch (err) {
      res.redirect('/404');
    }
  })
);

// Attach accessory
router.post(
  '/attach/:productId',
  preloadCube(),
  isOwner(),
  asyncWrapper(async (req, res) => {
    const cubeId = req.params.productId;
    const accessoryId = req.body.accessory;

    try {
      await req.storage.attachAccessory(cubeId, accessoryId);
      res.redirect(`/products/details/${cubeId}`);
    } catch (err) {
      res.redirect('/404');
    }
  })
);

module.exports = router;
