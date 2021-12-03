module.exports = {
  async detailsCube(req, res) {
    try {
      const ctx = {
        title: 'Cube Details',
        cube: await req.storage.getCubeById(req.params.id),
      };

      if (ctx.cube === undefined) {
        throw new Error();
      }

      res.render('detailsCube', ctx);
    } catch (err) {
      res.redirect('/404');
    }
  },
};
