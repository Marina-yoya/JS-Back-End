module.exports = {
  async createComment(req, res) {
    const cubeId = req.params.cubeId;

    const comment = {
      author: req.body.author.trim(),
      content: req.body.content.trim(),
    };

    try {
      await req.storage.createComment(cubeId, comment);
      res.redirect(`/details/${cubeId}`);
    } catch (err) {
      res.redirect('/404');
    }
  },
};
