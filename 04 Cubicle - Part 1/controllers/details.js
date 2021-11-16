module.exports = {
	async details(req, res) {
		const ctx = {
			title: 'Cube Details',
			cube: await req.storage.getById(req.params.id),
		};

		if (ctx.cube === undefined) {
			return res.redirect('/404');
		}

		res.render('details', ctx);
	},
};
