module.exports = {
	async get(req, res) {
		res.render('create', { title: 'Create Cube' });
	},

	async post(req, res) {
		const cube = {
			name: req.body.name.trim(),
			description: req.body.description.trim(),
			imageUrl: req.body.imageUrl.trim(),
			difficulty: Number(req.body.difficulty),
		};

		await req.storage.create(cube);
		res.redirect('/');
	},
};