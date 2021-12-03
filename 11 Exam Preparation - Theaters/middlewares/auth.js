const bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken'),
	userService = require('../services/user'),
	{ TOKEN_SECRET, COOKIE_NAME } = require('../config');

module.exports = () => (req, res, next) => {
	if (parseToken(req, res)) {
		req.auth = {
			async login(username, password) {
				const token = await login(username, password);
				res.cookie(COOKIE_NAME, token);
			},
			async register(username, password) {
				const token = await register(username, password);
				res.cookie(COOKIE_NAME, token);
			},
			logout: () => {
				res.clearCookie(COOKIE_NAME);
				res.redirect('/');
			},
		};

		next();
	}
};

const login = async (username, password) => {
	const user = await userService.getUserByUsername(username);

	if (!user) {
		const err = new Error('No such user!');
		err.type = 'credential';
		throw err;
	}

	const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

	if (!passwordMatch) {
		const err = new Error('Incorrect password!');
		err.type = 'credential';
		throw err;
	}

	return generateToken(user);
};

const register = async (userData) => {
	const { username, password } = userData;
	const existingUsername = await userService.getUserByUsername(username);

	if (existingUsername) {
		throw new Error('Username is taken!');
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await userService.createUser(username, hashedPassword);
	return generateToken(user);
};

const generateToken = (userData) => {
	return jwt.sign(
		{
			_id: userData._id,
			username: userData.username,
		},
		TOKEN_SECRET
	);
};

const parseToken = (req, res) => {
	const token = req.cookies[COOKIE_NAME];

	if (token) {
		try {
			const userData = jwt.verify(token, TOKEN_SECRET);
			req.user = userData;
			res.locals.user = userData;
		} catch (err) {
			res.clearCookie(COOKIE_NAME);
			res.redirect('/auth/login');

			return false;
		}
	}

	return true;
};
