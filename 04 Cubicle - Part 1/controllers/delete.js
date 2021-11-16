module.exports = {
	async del(req, res) {
		await req.storage.deleteCube(req.params.id);
		res.redirect('/');
	},
};
