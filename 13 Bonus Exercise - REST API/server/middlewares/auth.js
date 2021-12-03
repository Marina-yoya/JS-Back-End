const jwt = require('jsonwebtoken'),
	{ TOKEN_SECRET } = require('../config');

module.exports = () => (req, res, next) => {
	const token = req.headers['x-authorization'] || undefined;

	if (token) {
		try {
			const userData = jwt.verify(token, TOKEN_SECRET);
			req.user = userData;
		} catch (err) {
			res.status(401).json({ message: 'Invalid access token.' });
		}
	}

	next();
};
