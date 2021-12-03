const bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken'),
	router = require('express').Router(),
	parseError = require('../util/parsers'),
	{ TOKEN_SECRET } = require('../config'),
	{ isGuest } = require('../middlewares/guards'),
	{ findByEmail, create } = require('../services/user');

router.post('/login', isGuest(), async (req, res) => {
	try {
		const user = await findByEmail(req.body.email.toLocaleLowerCase().trim());
		if (!user) {
			const err = new Error('No user with such a email is registered.');
			err.type = 'credential';
			err.status = 401;
			throw err;
		}

		const verifyPassword = await bcrypt.compare(req.body.password.trim(), user.hashedPassword);
		if (!verifyPassword) {
			const err = new Error('Incorrect password!');
			err.type = 'credential';
			err.status = 401;
			throw err;
		}

		const userData = { email: user.email, _id: user._id };
		userData.accessToken = createToken(userData);

		res.json(userData);
	} catch (err) {
		const message = parseError(err);
		return err.type === 'credential'
			? res.status(err.status || 400).json({ message: 'Wrong email or password.' })
			: req.status(err.status || 400).json({ message });
	}
});

router.post('/register', isGuest(), async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email && !email.trim()) throw new Error('Email is required.');
		if (password.trim().length < 5) throw new Error('Password must be at least 5 characters long.');

		const hashedPassword = await bcrypt.hash(password.trim(), 10);
		const { _id } = await create(email.toLocaleLowerCase().trim(), hashedPassword);
		const userData = { _id, email: email.trim(), accessToken: createToken({ _id }) };

		res.json(userData);
	} catch (err) {
		const message = parseError(err);
		res.status(err.status || 400).json({ message });
	}
});

router.get('/logout', (req, res) => {
	res.status(204).end();
});

// JWT Token
const createToken = (userData) => {
	return jwt.sign(userData, TOKEN_SECRET);
};

module.exports = router;
