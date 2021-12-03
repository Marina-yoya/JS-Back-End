module.exports = {
  async deleteCube(req, res) {
    try {
      await req.storage.deleteCube(req.params.id);
      res.redirect('/');
    } catch (err) {
      res.redirect('/404');
    }
  },
};
