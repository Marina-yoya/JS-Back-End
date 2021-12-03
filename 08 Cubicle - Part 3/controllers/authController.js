const router = require('express').Router(),
  { isGuest, isAuth } = require('../middlewares/guards');

// Login
router.get('/login', isGuest(), (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', isGuest(), async (req, res) => {
  try {
    await req.auth.login(req.body);
    res.redirect('/products');
  } catch (err) {
    const ctx = {
      title: 'Login',
      err: err.message,
      data: { username: req.body.username },
    };
    res.render('login', ctx);
  }
});

// Register
router.get('/register', isGuest(), (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post('/register', isGuest(), async (req, res) => {
  try {
    await req.auth.register(req.body);
    res.redirect('/products');
  } catch (err) {
    const ctx = {
      title: 'Register',
      err: err.message,
      data: { username: req.body.username },
    };

    res.render('register', ctx);
  }
});

// Logout
router.get('/logout', isAuth(), (req, res) => {
  req.auth.logout();
  res.redirect('/products');
});

module.exports = router;
