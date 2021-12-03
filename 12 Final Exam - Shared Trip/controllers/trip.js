const router = require('express').Router(),
	{ isAuth, isOwner } = require('../middlewares/guards'),
	{ body, validationResult } = require('express-validator');

// get
router.get('/all', async (req, res) => {
	try {
		const trips = await req.storage.getAllTrips();
		res.render('trip/all', { trips });
	} catch (err) {
		res.render('404');
	}
});

// create
router.get('/create', isAuth(), (req, res) => {
	res.render('trip/create');
});

router.post(
	'/create',
	isAuth(),

	body('date').trim().notEmpty().withMessage('Valid date is required.'),
	body('time').trim().notEmpty().withMessage('Valid time is required.'),
	body('startPoint').trim().isLength({ min: 4 }).withMessage('Starting point must be at least 4 characters long.'),
	body('endPoint').trim().isLength({ min: 4 }).withMessage('End point must be at least 4 characters long.'),
	body('seats').custom((value) => {
		if (Number(value) >= 0 && Number(value) <= 4) return true;
		else throw new Error('Seats must be between 0 and 4.');
	}),
	body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long.'),
	body('vehicleBrand').trim().isLength({ min: 4 }).withMessage('Brand must be at least 4 characters long.'),
	body('price').custom((value) => {
		if (Number(value) >= 1 && Number(value) <= 50) return true;
		else throw new Error('Price must be between 1 and 50.');
	}),
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
		const { errors } = validationResult(req);

		const tripData = {
			date: req.body.date,
			time: req.body.time,
			imageUrl: req.body.imageUrl.trim(),
			endPoint: req.body.endPoint.trim(),
			seats: Number(req.body.seats.trim()),
			price: Number(req.body.price.trim()),
			startPoint: req.body.startPoint.trim(),
			description: req.body.description.trim(),
			vehicleBrand: req.body.vehicleBrand.trim(),
			author: await req.storage.getUserById(req.user._id),
		};

		try {
			if (errors.length) {
				const message = errors.map((e) => e.msg).join('\n');
				throw new Error(message);
			}

			req.storage.createTrip(tripData);
			res.redirect('/');
		} catch (err) {
			const ctx = {
				tripData,
				errors: err.message.split('\n'),
			};
			res.render('trip/create', ctx);
		}
	}
);

// edit
router.get('/edit/:id', isOwner(), async (req, res) => {
	try {
		const tripData = await req.storage.getTripById(req.params.id);
		res.render('trip/edit', { tripData });
	} catch (err) {
		res.render('404');
	}
});

router.post(
	'/edit/:id',
	isOwner(),

	body('date').trim().notEmpty().withMessage('Valid date is required.'),
	body('time').trim().notEmpty().withMessage('Valid time is required.'),
	body('startPoint').trim().isLength({ min: 4 }).withMessage('Starting point must be at least 4 characters long.'),
	body('endPoint').trim().isLength({ min: 4 }).withMessage('End point must be at least 4 characters long.'),

	body('seats').custom((value) => {
		if (Number(value) >= 0 && Number(value) <= 4) return true;
		else throw new Error('Seats must be between 0 and 4.');
	}),

	body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters long.'),
	body('vehicleBrand').trim().isLength({ min: 4 }).withMessage('Brand must be at least 4 characters long.'),
	body('price').custom((value) => {
		if (Number(value) >= 1 && Number(value) <= 50) return true;
		else throw new Error('Price must be between 1 and 50.');
	}),

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
		const { errors } = validationResult(req);

		const tripData = {
			date: req.body.date,
			time: req.body.time,
			imageUrl: req.body.imageUrl.trim(),
			endPoint: req.body.endPoint.trim(),
			seats: Number(req.body.seats.trim()),
			price: Number(req.body.price.trim()),
			startPoint: req.body.startPoint.trim(),
			description: req.body.description.trim(),
			vehicleBrand: req.body.vehicleBrand.trim(),
			author: await req.storage.getUserById(req.user._id),
		};

		try {
			if (errors.length) {
				const message = errors.map((e) => e.msg).join('\n');
				throw new Error(message);
			}

			await req.storage.editTrip(req.params.id, tripData);
			res.redirect('/trips/all');
		} catch (err) {
			const ctx = {
				tripData,
				errors: err.message.split('\n'),
			};

			ctx.tripData._id = req.params.id;
			res.render('trip/edit', ctx);
		}
	}
);

// details
router.get('/details/:id', isAuth(), async (req, res) => {
	try {
		const tripData = await req.storage.getTripById(req.params.id);
		tripData.isAuthor = tripData.author._id == req.user._id;
		tripData.hasJoined = Boolean(tripData.companions.find((u) => u == req.user._id)) ? true : false;

		res.render('trip/details', { tripData });
	} catch (err) {
		res.render('404');
	}
});

// join
router.get('/join/:id', isAuth(), async (req, res) => {
	try {
		const tripData = await req.storage.getTripById(req.params.id);
		tripData.hasJoined = Boolean(tripData.companions.find((u) => u == req.user._id)) ? true : false;
		if (tripData.hasJoined === false) await req.storage.joinTrip(req.params.id, req.user._id);

		res.redirect(`/trips/details/${tripData._id}`);
	} catch (err) {
		res.render('404');
	}
});

// delete
router.get('/delete/:id', isOwner(), async (req, res) => {
	try {
		await req.storage.deleteTrip(req.params.id);
		res.redirect('/trips/all');
	} catch (err) {
		res.render('404');
	}
});

module.exports = router;
