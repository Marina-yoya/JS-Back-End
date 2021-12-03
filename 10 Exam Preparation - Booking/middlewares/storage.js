const user = require('../services/user');
const hotel = require('../services/hotel');

module.exports = () => (req, res, next) => {
	req.storage = { ...user, ...hotel };

	next();
};
