const router = require('express').Router(),
	{ isGuest, isAuth } = require('../middlewares/guards'),
	{ body, validationResult } = require('express-validator');

// login
router.get('/login', isGuest(), (req, res) => {
	res.render('auth/login');
});

router.post('/login', isGuest(), async (req, res) => {
	try {
		await req.auth.login(req.body.username.trim(), req.body.password.trim());
		res.redirect('/');
	} catch (err) {
		const ctx = {
			errors: [err.type === 'credential' ? 'Wrong username or password.' : err.message],
			userData: { username: req.body.username },
		};
		res.render('auth/login', ctx);
	}
});

// register
router.get('/register', isGuest(), (req, res) => {
	res.render('auth/register');
});

router.post(
	'/register',
	isGuest(),

	body('username')
		.trim()
		.isLength({ min: 3 })
		.withMessage('Username must be at least 3 characters long.')
		.bail()
		.isAlphanumeric()
		.withMessage('Username must contain only digits and latin letters.'),

	body('password')
		.trim()
		.isLength({ min: 3 })
		.withMessage('Password must be at least 3 characters long.')
		.bail()
		.isAlphanumeric()
		.withMessage('Password must contain only digits and latin letters.'),

	body('rePassword').custom((value, { req }) => {
		if (value.trim() === req.body.password.trim()) return true;
		else throw new Error("Passwords don't match.");
	}),

	async (req, res) => {
		const userData = {
			username: req.body.username.trim(),
			password: req.body.password.trim(),
		};

		try {
			const { errors } = validationResult(req);

			if (errors.length) {
				const message = errors.map((e) => e.msg).join('\n');
				throw new Error(message);
			}

			await req.auth.register(userData);
			res.redirect('/');
		} catch (err) {
			const ctx = { errors: err.message.split('\n'), userData: { username: userData.username } };
			res.render('auth/register', ctx);
		}
	}
);

// logout
router.get('/logout', (req, res) => {
	req.auth.logout();
});

module.exports = router;