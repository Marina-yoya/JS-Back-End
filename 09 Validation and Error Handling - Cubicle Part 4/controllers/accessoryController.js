const router = require('express').Router(),
  asyncWrapper = require('../util/asyncWrapper');

// Create
router.get('/create',  (req, res) => {
  res.render('createAccessory', { title: 'Create Accessory' });
});

router.post('/create', asyncWrapper( async (req, res) => {
  const accessory = {
    name: req.body.name.trim(),
    imageUrl: req.body.imageUrl.trim(),
    description: req.body.description.trim(),
  };

  try {
    await req.storage.createAccessory(accessory);
    res.redirect('/');
  } catch (err) {
    return err.name === 'ValidationError'
      ? res.render('createAccessory', { title: 'Create Accessory', err: 'Please enter valid details and try again!' })
      : res.redirect('/404');
  }
}));

module.exports = router;
