module.exports = {
  async home(req, res) {
    try {
      const ctx = {
        title: 'Cubicle',
        to: req.query.to || '',
        from: req.query.from || '',
        search: req.query.search || '',
        cubes: await req.storage.getAllCubes(req.query),
      };

      res.render('index', ctx);
    } catch (err) {
      res.redirect('/404');
    }
  },
};
