const router = require('express').Router();

router.get('/', async (req, res) => {
	try {
		const plays = await req.storage.getAllPlays();
		res.render('home', { plays });
	} catch (err) {
		console.error(err.message);
		res.render('404');
	}
});

module.exports = router;
