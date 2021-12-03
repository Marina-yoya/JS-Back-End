const router = require('express').Router(),
  { isAuth } = require('../middlewares/guards'),
  asyncWrapper = require('../util/asyncWrapper');

// Create
router.post(
  '/create/:productId',
  isAuth(),
  asyncWrapper(async (req, res) => {
    const authorId = req.user._id;
    const cubeId = req.params.productId;

    const comment = {
      author: authorId,
      content: req.body.content.trim(),
    };

    try {
      await req.storage.createComment(cubeId, comment);
      res.redirect(`/products/details/${cubeId}`);
    } catch (err) {
      res.redirect('/404');
    }
  })
);

module.exports = router;
