const auth = require('../controllers/auth'),
	plays = require('../controllers/plays'),
	home = require('../controllers/home');

module.exports = (app) => {
	app.use('/', home);
	app.use('/auth', auth);
	app.use('/plays', plays);

	
};
