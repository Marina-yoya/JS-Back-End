// Controllers
const { home } = require('../controllers/home'),
  { about } = require('../controllers/about'),
  { notFound } = require('../controllers/notFound'),
  { deleteCube } = require('../controllers/deleteCube'),
  { detailsCube } = require('../controllers/detailsCube'),
  { createComment } = require('../controllers/createComment'),
  { get: getEditCube, post: postEditCube } = require('../controllers/editCube'),
  { get: getCreateCube, post: postCreateCube } = require('../controllers/createCube'),
  { get: getCreateAccessory, post: postCreateAccessory } = require('../controllers/createAccessory'),
  { get: getAttachAccessories, post: postAttachAccessories } = require('../controllers/attachAccessories');

module.exports = (app) => {
  // Routing table
  app.get('/', home);
  app.get('/about', about);
  app.get('/cube/create', getCreateCube);
  app.get('/cube/edit/:id', getEditCube);
  app.get('/cube/delete/:id', deleteCube);
  app.get('/cube/details/:id', detailsCube);
  app.get('/accessory/create', getCreateAccessory);
  app.get('/cube/details/:id/attachAccessories', getAttachAccessories);

  app.post('/cube/edit/:id', postEditCube);
  app.post('/cube/create', postCreateCube);
  app.post('/comment/create/:cubeId', createComment);
  app.post('/accessory/create', postCreateAccessory);
  app.post('/cube/details/:id/attachAccessories', postAttachAccessories);

  app.all('*', notFound);
};
