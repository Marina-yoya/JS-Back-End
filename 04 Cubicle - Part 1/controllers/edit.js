module.exports = {
	async get(req, res) {
		const ctx = {
			title: 'Edit Cube',
			cube: await req.storage.getById(req.params.id),
		};

		if (ctx.cube === undefined) {
			return res.redirect('/404');
		}

		// for the right option to be preselect
		ctx.cube[`select${ctx.cube.difficulty}`] = true;
		res.render('edit', ctx);
	},

	async post(req, res) {
		const cube = {
			name: req.body.name.trim(),
			description: req.body.description.trim(),
			imageUrl: req.body.imageUrl.trim(),
			difficulty: Number(req.body.difficulty),
		};

		try {
			await req.storage.edit(req.params.id, cube);
			res.redirect('/');
		} catch (err) {
			res.redirect('404');
		}
	},
};
