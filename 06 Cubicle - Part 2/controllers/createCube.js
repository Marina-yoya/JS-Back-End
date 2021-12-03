module.exports = {
  get(req, res) {
    res.render('createCube', { title: 'Create Cube' });
  },

  async post(req, res) {
    const cube = {
      name: req.body.name.trim(),
      imageUrl: req.body.imageUrl.trim(),
      difficulty: Number(req.body.difficulty),
      description: req.body.description.trim(),
    };

    try {
      await req.storage.createCube(cube);
      res.redirect('/');
    } catch (err) {
      return err.name === 'ValidationError'
        ? res.render('createCube', { title: 'Create Cube', err: 'Please enter valid details and try again!' })
        : res.redirect('/404');
    }
  },
};
