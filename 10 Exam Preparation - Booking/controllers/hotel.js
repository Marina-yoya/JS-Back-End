const router = require('express').Router(),
	{ isUser, isOwner } = require('../middlewares/guards'),
	{ body, validationResult } = require('express-validator');

// details
router.get('/details/:id', async (req, res) => {
	try {
		const hotelId = req.params.id;
		const hotelData = await req.storage.getHotelById(hotelId);
		const isOwner = req.user?._id == hotelData.owner;
		const isBooked = req.user && hotelData.bookedBy.find((user) => user._id == req.user._id) ? true : false;

		res.render('hotel/details', { isOwner, isBooked, hotelData });
	} catch (err) {
		console.error(err.message);
		res.render('404/notFound');
	}
});

// create
router.get('/create', isUser(), (req, res) => {
	res.render('hotel/create');
});

router.post(
	'/create',
	isUser(),
	body('name').isLength({ min: 4 }).withMessage('Name must be at least 4 characters long!'),
	body('city').isLength({ min: 3 }).withMessage('City must be at least 3 characters long!'),
	body('rooms').isFloat({ min: 1, max: 100 }).withMessage('Rooms must be between 1 and 100!'),
	body('imageUrl')
		.matches(new RegExp(/^https?/))
		.withMessage('Image must be a valid URL!'),

	async (req, res) => {
		const { errors } = validationResult(req);

		const hotelData = {
			bookedBy: [],
			owner: req.user._id,
			name: req.body.name.trim(),
			city: req.body.city.trim(),
			rooms: req.body.rooms.trim(),
			imageUrl: req.body.imageUrl.trim(),
		};

		try {
			if (errors.length) {
				const message = errors.map((e) => e.msg).join('\n');
				throw new Error(message);
			}

			await req.storage.createHotel(hotelData, req.user._id);
			res.redirect('/');
		} catch (err) {
			const ctx = { hotelData, errors: err.message.split('\n') };
			res.render('hotel/create', ctx);
		}
	}
);

// edit
router.get('/edit/:id', isOwner(), async (req, res) => {
	try {
		const hotelId = req.params.id;
		const hotelData = await req.storage.getHotelById(hotelId);

		res.render('hotel/edit', { hotelData });
	} catch (err) {
		console.error(err.message);
		res.render('404/notFound');
	}
});

router.post(
	'/edit/:id',
	isOwner(),
	body('name').isLength({ min: 4 }).withMessage('Name must be at least 4 characters long!'),
	body('city').isLength({ min: 3 }).withMessage('City must be at least 3 characters long!'),
	body('rooms').isFloat({ min: 1, max: 100 }).withMessage('Rooms must be between 1 and 100!'),
	body('imageUrl')
		.matches(new RegExp(/^https?/))
		.withMessage('Image must be a valid URL!'),

	async (req, res) => {
		const { errors } = validationResult(req);

		const hotelData = {
			_id: req.params.id,
			name: req.body.name.trim(),
			city: req.body.city.trim(),
			rooms: req.body.rooms.trim(),
			imageUrl: req.body.imageUrl.trim(),
		};

		try {
			if (errors.length) {
				const message = errors.map((e) => e.msg).join('\n');
				throw new Error(message);
			}

			await req.storage.editHotel(hotelData, req.params.id);
			res.redirect('/');
		} catch (err) {
			const ctx = { hotelData, errors: err.message.split('\n') };
			res.render('hotel/edit', ctx);
		}
	}
);

// book
router.get('/book/:id', isUser(), async (req, res) => {
	try {
		try {
			await req.storage.bookHotel(req.user._id, req.params.id);
			res.redirect(`/hotel/details/${req.params.id}`);
		} catch (err) {
			// There should be a valid hotel record
			// otherwise the user wasn't gonna be on that page.
			const hotelData = await req.storage.getHotelById(req.params.id);
			res.render('hotel/details', { hotelData, errors: [err.message] });
		}
	} catch (err) {
		console.error(err.message);
		res.render('404/notFound');
	}
});

// delete
router.get('/delete/:id', isOwner(), async (req, res) => {
	try {
		const hotelData = await req.storage.getHotelById(req.params.id);
		res.render('hotel/delete', { hotelData });
	} catch (err) {
		console.error(err.message);
		res.render('404/notFound');
	}
});

router.post('/delete/:id', isOwner(), async (req, res) => {
	try {
		try {
			await req.storage.deleteHotel(req.params.id);
			res.redirect('/');
		} catch (err) {
			// There should be a valid hotel record
			// otherwise the user wasn't gonna be on that page.
			const hotelData = await req.storage.getHotelById(req.params.id);
			res.render('hotel/details', { hotelData, errors: [err.message] });
		}
	} catch (err) {
		console.error(err.message);
		res.render('404/notFound');
	}
});

module.exports = router;
