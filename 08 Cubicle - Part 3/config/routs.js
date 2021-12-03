const accessoryController = require('../controllers/accessoryController'),
  commentController = require('../controllers/commentController'),
  productController = require('../controllers/productController'),
  homeController = require('../controllers/homeController'),
  authController = require('../controllers/authController');

module.exports = (app) => {
  app.use('/accessories', accessoryController);
  app.use('/comments', commentController);
  app.use('/products', productController);
  app.use('/auth', authController);
  app.use('/', homeController);
  // Home controller comes last because inside the controller
  // I have catch all rout that needs to be last.
};
