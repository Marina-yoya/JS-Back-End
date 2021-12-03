const router = require('express').Router(),
  asyncWrapper = require('../util/asyncWrapper'),
  { isGuest, isAuth } = require('../middlewares/guards'),
  { body, validationResult } = require('express-validator');

// Login
router.get('/login', isGuest(), (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post(
  '/login',
  isGuest(),
  asyncWrapper(async (req, res) => {
    try {
      await req.auth.login(req.body);
      res.redirect('/products');
    } catch (err) {
      const ctx = {
        errors: [],
        title: 'Login',
        data: { username: req.body.username },
      };
      res.render('login', ctx);
    }
  })
);

// Register
router.get('/register', isGuest(), (req, res) => {
  res.render('register', { title: 'Register' });
});

router.post(
  '/register',
  isGuest(),
  body(
    'username',
    'Username must be at least 5 characters long and it may contain only latin letters and digits!'
  )
    .trim()
    .isLength({ min: 5 })
    .isAlphanumeric(),
  body(
    'password',
    'Password must be at least 8 characters long and it may contain only latin letters and digits!'
  )
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric(),
  body('repeatPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match!");
      }
      return true;
    }),
  asyncWrapper(async (req, res) => {
    try {
      const errors = Object.values(validationResult(req).mapped())
        .map((e) => e.msg)
        .join('\n');

      if (errors) {
        throw new Error(errors);
      }

      await req.auth.register(req.body);
      res.redirect('/products');
    } catch (err) {
      const ctx = {
        title: 'Register',
        errors: err.message.split('\n'),
        data: { username: req.body.username },
      };

      res.render('register', ctx);
    }
  })
);

// Logout
router.get('/logout', isAuth(), (req, res) => {
  req.auth.logout();
  res.redirect('/products');
});

module.exports = router;
