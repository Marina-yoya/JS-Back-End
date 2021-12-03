const router = require('express').Router(),
	{ isGuest, isAuth } = require('../middlewares/guards'),
	{ body, validationResult } = require('express-validator');

// login
router.get('/login', isGuest(), (req, res) => {
	res.render('auth/login');
});

router.post(
	'/login',
	isGuest(),
	body('email').trim().isEmail().withMessage('Invalid email.'),
	body('password').trim().isLength({ min: 4 }).withMessage('Password must be at least 4 characters long.'),

	async (req, res) => {
		const { errors } = validationResult(req);

		try {
			if (errors.length) {
				const message = errors.map((e) => e.msg).join('\n');
				throw new Error(message);
			}

			await req.auth.login(req.body.email.trim(), req.body.password.trim());
			res.redirect('/');
		} catch (err) {
			const ctx = {
				errors: err.type === 'credential' ? ['Wrong email or password.'] : err.message.split('\n'),
				userData: { email: req.body.email },
			};
			res.render('auth/login', ctx);
		}
	}
);

// register
router.get('/register', isGuest(), (req, res) => {
	res.render('auth/register');
});

router.post(
	'/register',
	isGuest(),
	body('email').trim().isEmail().withMessage('Invalid email.'),
	body('password').trim().isLength({ min: 4 }).withMessage('Password must be at least 4 characters long.'),
	body('rePassword').custom((value, { req }) => {
		if (value.trim() === req.body.password.trim()) return true;
		else throw new Error("Passwords don't match.");
	}),
	body('female').custom((value, { req }) => {
		if (value || req.body.male) return true;
		else throw new Error('Please Chose a gender.');
	}),

	async (req, res) => {
		const { errors } = validationResult(req);

		const userData = {
			male: Boolean(req.body.male),
			email: req.body.email.trim(),
			female: Boolean(req.body.female),
			password: req.body.password.trim(),
		};

		try {
			if (errors.length) {
				const message = errors.map((e) => e.msg).join('\n');
				throw new Error(message);
			}

			const gender = userData.male ? 'male' : 'female';
			const photo = gender === 'male' ? '/static/images/male.png' : '/static/images/female.png';
			await req.auth.register(gender, photo, req.body.email.trim(), req.body.password.trim());
			res.redirect('/');
		} catch (err) {
			const ctx = {
				errors: err.message.split('\n'),
				userData: { email: userData.email, female: userData.female, male: userData.male },
			};
			res.render('auth/register', ctx);
		}
	}
);

// logout
router.get('/logout', (req, res) => {
	req.auth.logout();
});

// profile
router.get('/account/:id', isAuth(), async (req, res) => {
	try {
		const userData = await req.storage.getUserById(req.user._id);
		res.render('auth/profile', { userData });
	} catch (err) {
		console.error(err.message);
		res.render('404');
	}
});

module.exports = router;
