const router = require('express').Router();

router.use((req, res, next) => {
	// Define a middleware if needed
	next();
});

router
	.get((req, res) => {
		res.send('Catalog page');
	})

	.post((req, res) => {
		res.status(201);
		res.send('Article created');
	});

module.exports = router;
