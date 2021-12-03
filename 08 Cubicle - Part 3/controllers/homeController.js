const router = require('express').Router();

// Redirect to catalog
router.get('/', (req, res) => {
  res.redirect('/products');
});

// About page
router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// Page not found
router.all('*', (req, res) => {
  res.render('404', { title: 'Page Not Found' });
});

module.exports = router;
