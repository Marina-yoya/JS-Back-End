const http = require('http'),
	router = require('./router'),
	homeController = require('./controllers/homeController'),
	editController = require('./controllers/editController'),
	deleteController = require('./controllers/deleteController'),
	addCatController = require('./controllers/addCatController'),
	searchController = require('./controllers/searchController'),
	addBreedController = require('./controllers/addBreedController');

router.get('/', homeController);
router.get('/add-cat', addCatController);
router.get('/add-breed', addBreedController);

router.post('/search', searchController);
router.post('/add-cat', addCatController);
router.post('/add-breed', addBreedController);

const PORT = process.env.PORT || 5000;
// Of course there won't be an actual environment port as this will never reach deployment stage.

const requestHandler = (req, res) => {

	// For requests that contains id in their url
	if (req.url.startsWith('/edit/')) {
		return editController(req, res);
	}

	if (req.url.startsWith('/delete/')) {
		return deleteController(req, res);
	}

	// For requests with static url
	const controller = router.matchController(req.method, req.url);
	controller(req, res);
};

const server = http.createServer(requestHandler);
server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
