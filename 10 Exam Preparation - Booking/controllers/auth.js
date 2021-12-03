const router = require('express').Router(),
	{ isGuest, isUser } = require('../middlewares/guards'),
	{ body, validationResult } = require('express-validator');

// login
router.get('/login', isGuest(), (req, res) => {
	res.render('user/login');
});

router.post('/login', isGuest(), async (req, res) => {
	try {
		await req.auth.login(req.body.username, req.body.password);
		res.redirect('/');
	} catch (err) {
		const ctx = { errors: [err.message], userData: { username: req.body.username } };
		res.render('user/login', ctx);
	}
});

// register
router.get('/register', isGuest(), (req, res) => {
	res.render('user/register');
});

router.post(
	'/register',
	isGuest(),
	body('email').isEmail().withMessage('Invalid email!'),
	body('username')
		.isLength({ min: 3 })
		.withMessage('Username must be at least 3 characters long!')
		.bail()
		.matches(new RegExp(/[a-zA-Z0-9]$/))
		.withMessage('Username must contain only alphanumerics!'),
	body('password')
		.isLength({ min: 5 })
		.withMessage('Password must be at least 5 characters long!')
		.bail()
		.matches(new RegExp(/[a-zA-Z0-9]$/))
		.withMessage('Password must contain only alphanumerics!'),
	body('rePassword').custom((value, { req }) => {
		if (value === req.body.password) return true;
		else throw new Error("Passwords don't match!");
	}),

	async (req, res) => {
		const { errors } = validationResult(req);

		const userData = {
			email: req.body.email.trim(),
			username: req.body.username.trim(),
			password: req.body.password.trim(),
		};

		try {
			if (errors.length) {
				const message = errors.map((e) => e.msg).join('\n');
				throw new Error(message);
			}

			await req.auth.register(userData);
			res.redirect('/');
		} catch (err) {
			const ctx = { errors: err.message.split('\n'), userData: { username: userData.username, email: userData.email } };
			res.render('user/register', ctx);
		}
	}
);

// logout
router.get('/logout', (req, res) => {
	req.auth.logout();
});

// profile
router.get('/profile/:id', isUser(), async (req, res) => {
	try {
		const userData = await req.storage.getUserById(req.user._id);
		res.render('user/profile', { userData });
	} catch (err) {
		console.error(err.message);
		res.render('404/notFound');
	}
});

module.exports = router;
