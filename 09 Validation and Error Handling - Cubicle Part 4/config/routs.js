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
  // I have 'catch all' rout that needs to be registered last.

  app.use((err, req, res, next) => {
    // This handler is potential global error handler.

    // Applies to synchronous errors only!!
    // To make it work with asynchronous errors, the error needs to thrown inside the
    // 'next' function within the controller, middleware, etc. where the error occurred.
    // Ref: util/asyncWrapper

    console.error(`Error>>> ${err.message}`)
    res.status(500).send('<h1>Internal server error!</h1>');
  });
};
