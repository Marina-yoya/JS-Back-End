const user = require('../services/user');
const play = require('../services/play');

module.exports = () => (req, res, next) => {
	req.storage = { ...user, ...play };

	next();
};
