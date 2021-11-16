module.exports = {
	async home(req, res) {
		const ctx = {
			title: 'Cubicle',
			to: req.query.to || '',
			from: req.query.from || '',
			search: req.query.search || '',
			cubes: await req.storage.getAll(req.query),
		};

		res.render('index', ctx);
	},
};
