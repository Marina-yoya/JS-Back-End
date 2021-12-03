const user = require('../services/user');
const trip = require('../services/trip');

module.exports = () => (req, res, next) => {
	req.storage = { ...user, ...trip };

	next();
};
