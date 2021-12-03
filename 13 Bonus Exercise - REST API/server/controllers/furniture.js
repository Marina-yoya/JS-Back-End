const router = require('express').Router(),
	parseError = require('../util/parsers'),
	preload = require('../middlewares/preload'),
	{ isAuth, isOwner } = require('../middlewares/guards'),
	{ getAll, create, update, remove } = require('../services/furniture');

// Get
router.get('/', async (req, res) => {
	try {
		const records = await getAll();
		res.json(records);
	} catch (err) {
		res.status(err.status || 404).json({ message: err.message });
	}
});

// Create
router.post('/', isAuth(), async (req, res) => {
	try {
		const record = await create({
			img: req.body.img,
			type: req.body.type,
			owner: req.user._id,
			material: req.body.material,
			price: Number(req.body.price),
			description: req.body.description,
		});

		res.status(201).json(record);
	} catch (err) {
		const message = parseError(err);
		res.status(err.status || 400).json({ message });
	}
});

// Details
router.get('/:id', preload(), async (req, res) => {
	res.json(req.data);
});

// Edit
router.put('/:id', isAuth(), preload(), isOwner(), async (req, res) => {
	try {
		const record = await update(req.data, {
			img: req.body.img,
			type: req.body.type,
			material: req.body.material,
			price: Number(req.body.price),
			description: req.body.description,
		});

		res.json(record);
	} catch (err) {
		const message = parseError(err);
		res.status(err.status || 404).json({ message });
	}
});

// Delete
router.delete('/:id', isAuth(), preload(), isOwner(), async (req, res) => {
	try {
		await remove(req.params.id);
		res.status(204).end();
	} catch (err) {
		const message = parseError(err);
		res.status(err.status || 404).json({ message });
	}
});

module.exports = router;
