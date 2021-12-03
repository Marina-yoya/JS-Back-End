const router = require('express').Router(),
	{ isAuth, isAuthor } = require('../middlewares/guards'),
	{ body, validationResult } = require('express-validator');

// sort
router.get('/sort-by-date', async (req, res) => {
	try {
		const plays = await req.storage.getAllPlays('dateAscending');
		res.render('home', { plays });
	} catch (err) {
		console.error(err.message);
		res.render('404');
	}
});

router.get('/sort-by-likes', async (req, res) => {
	try {
		const plays = await req.storage.getAllPlays('byLikes');
		res.render('home', { plays });
	} catch (err) {
		console.error(err.message);
		res.render('404');
	}
});

// create
router.get('/create', isAuth(), (req, res) => {
	res.render('plays/create');
});

router.post(
	'/create',
	isAuth(),

	body('title').trim().notEmpty().withMessage('Title is required.'),

	body('description')
		.trim()
		.notEmpty()
		.withMessage('Description is required.')
		.bail()
		.isLength({ max: 50 })
		.withMessage('Description must be less than 50 characters long.'),

	body('imageUrl')
		.trim()
		.notEmpty()
		.withMessage('Image url is required.')
		.bail()
		.custom((value) => {
			if (value.toLowerCase().substr(0, 8) === 'https://' || value.toLowerCase().substr(0, 7) === 'http://') return true;
			else throw new Error('Image url must be a valid url.');
		}),

	async (req, res) => {
		const playData = {
			author: req.user._id,
			title: req.body.title.trim(),
			public: Boolean(req.body.public),
			imageUrl: req.body.imageUrl.trim(),
			description: req.body.description.trim(),
		};

		try {
			const { errors } = validationResult(req);

			const existing = await req.storage.getPlayByTitle(playData.title);
			if (existing) throw new Error('Play with such a title already exists.');

			if (errors.length) {
				const message = errors.map((e) => e.msg).join('\n');
				throw new Error(message);
			}

			await req.storage.createPlay(playData);
			res.redirect('/');
		} catch (err) {
			const ctx = { errors: err.message.split('\n'), playData };
			res.render('plays/create', ctx);
		}
	}
);

// edit
router.get('/edit/:id', isAuthor(), async (req, res) => {
	try {
		const playData = await req.storage.getPlayById(req.params.id);
		res.render('plays/edit', { playData });
	} catch (err) {
		res.render('404');
	}
});

router.post(
	'/edit/:id',
	isAuthor(),

	body('title').trim().notEmpty().withMessage('Title is required.'),

	body('description')
		.trim()
		.notEmpty()
		.withMessage('Description is required.')
		.bail()
		.isLength({ max: 50 })
		.withMessage('Description must be less than 50 characters long.'),

	body('imageUrl')
		.trim()
		.notEmpty()
		.withMessage('Image url is required.')
		.bail()
		.custom((value) => {
			if (value.toLowerCase().substr(0, 8) === 'https://' || value.toLowerCase().substr(0, 7) === 'http://') return true;
			else throw new Error('Image url must be a valid url.');
		}),

	async (req, res) => {
		const playData = {
			author: req.user._id,
			title: req.body.title.trim(),
			public: Boolean(req.body.public),
			imageUrl: req.body.imageUrl.trim(),
			description: req.body.description.trim(),
		};

		try {
			const { errors } = validationResult(req);

			if (errors.length) {
				const message = errors.map((e) => e.msg).join('\n');
				throw new Error(message);
			}

			await req.storage.editPlay(playData, req.params.id);
			res.redirect('/');
		} catch (err) {
			const ctx = { errors: err.message.split('\n'), playData };
			res.render('plays/edit', ctx);
		}
	}
);

// details
router.get('/details/:id', isAuth(), async (req, res) => {
	try {
		const playData = await req.storage.getPlayById(req.params.id);
		playData.isAuthor = playData.author._id == req.user._id;
		playData.isLiked = playData.userLikes.find((u) => u._id == req.user._id);
		res.render('plays/details', { playData });
	} catch (err) {
		res.render('404');
	}
});

// likes
router.get('/like/:id', isAuth(), async (req, res) => {
	try {
		await req.storage.likePlay(req.params.id, req.user._id);
		res.redirect(`/plays/details/${req.params.id}`);
	} catch (err) {
		res.render('404');
	}
});

// delete
router.get('/delete/:id', isAuthor(), async (req, res) => {
	try {
		const playData = await req.storage.getPlayById(req.params.id);
		res.render('plays/delete', { playData });
	} catch (err) {
		res.render('404');
	}
});

router.post('/delete/:id', isAuthor(), async (req, res) => {
	try {
		await req.storage.deletePlay(req.params.id);
		res.redirect('/');
	} catch (err) {
		res.render('404');
	}
});

module.exports = router;
