const accessoryService = require('../services/accessory'),
  productService = require('../services/product'),
  commentService = require('../services/comment');

const init = () => {
  return (req, res, next) => {
    req.storage = {
      editProduct: productService.edit,
      deleteProduct: productService.del,
      createProduct: productService.create,
      getAllProducts: productService.getAll,
      attachAccessory: productService.attach,
      getProductById: productService.getById,
      createComment: commentService.create,
      createAccessory: accessoryService.create,
      getAllAccessories: accessoryService.getAll,
    };

    next();
  };
};

module.exports = init;
