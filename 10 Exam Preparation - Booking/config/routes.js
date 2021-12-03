const auth = require('../controllers/auth'),
	hotel = require('../controllers/hotel'),
	home = require('../controllers/home');

module.exports = (app) => {
	app.use('/', home);
	app.use('/auth', auth);
	app.use('/hotel', hotel);
};
