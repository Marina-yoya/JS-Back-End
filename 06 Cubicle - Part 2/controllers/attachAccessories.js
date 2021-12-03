module.exports = {
  async get(req, res) {
    try {
      const cube = await req.storage.getCubeById(req.params.id);
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
  },

  async post(req, res) {
    const cubeId = req.params.id;
    const accessoryId = req.body.accessory;

    try {
      await req.storage.attachAccessory(cubeId, accessoryId);
      res.redirect(`/cube/details/${cubeId}`);
    } catch (err) {
      res.redirect('/404');
    }
  },
};
