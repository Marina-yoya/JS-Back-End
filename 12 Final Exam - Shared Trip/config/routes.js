const auth = require('../controllers/auth'),
	home = require('../controllers/home'),
	trip = require('../controllers/trip');

module.exports = (app) => {
	app.use('/', home);
	app.use('/auth', auth);
	app.use('/trips', trip);

	// Page not found
	app.all('*', (req, res) => res.render('404'));
};
