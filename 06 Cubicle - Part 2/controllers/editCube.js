module.exports = {
  async get(req, res) {
    try {
      const ctx = {
        title: 'Edit Cube',
        cube: await req.storage.getCubeById(req.params.id),
      };

      if (ctx.cube === undefined) {
        throw new Error();
      }

      // For the right option to be preselect
      ctx.cube[`select${ctx.cube.difficulty}`] = true;

      res.render('editCube', ctx);
    } catch (err) {
      res.redirect('/404');
    }
  },

  async post(req, res) {
    const id = req.params.id;

    const cube = {
      _id: id,
      name: req.body.name.trim(),
      imageUrl: req.body.imageUrl.trim(),
      difficulty: Number(req.body.difficulty),
      description: req.body.description.trim(),
    };

    try {
      await req.storage.editCube(id, cube);
      res.redirect('/');
    } catch (err) {
      return err.name === 'ValidationError'
        ? res.render('editCube', { title: 'Edit Cube', cube, err: 'Please enter valid details and try again!' })
        : res.redirect('/404');
    }
  },
};
