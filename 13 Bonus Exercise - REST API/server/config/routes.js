const furniture = require('../controllers/furniture'),
	user = require('../controllers/user');

module.exports = (app) => {
	app.use('/users', user);
	app.use('/data/catalog', furniture);
};
