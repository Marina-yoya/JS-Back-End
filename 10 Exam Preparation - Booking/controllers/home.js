const router = require('express').Router();

router.get('/', async (req, res) => {
	try {
		const hotels = await req.storage.getAllHotels();
		res.render('home/home', { hotels });
	} catch (err) {
		console.error(err.message);
		res.render('404/notFound');
	}
});

module.exports = router;
