// config server
const express = require('express'),
	hbs = require('express-handlebars'),
	{ init: storage } = require('./models/storage'),
	app = express(),
	PORT = 5000;

// controllers
const { home } = require('./controllers/home'),
	{ about } = require('./controllers/about'),
	{ details } = require('./controllers/details'),
	{ notFound } = require('./controllers/notFound'),
	{ del: deleteCube } = require('./controllers/delete'),
	{ get: getEdit, post: postEdit } = require('./controllers/edit'),
	{ get: getCreate, post: postCreate } = require('./controllers/create');

// init
(async () => {
	// config view engine
	app.engine(
		'hbs',
		hbs({
			extname: '.hbs',
		})
	);

	app.set('view engine', 'hbs');

	// set middlewares
	app.use('/static', express.static('static'));
	app.use('/scripts', express.static('scripts'))
	app.use(express.urlencoded({ extended: false }));
	app.use(await storage());

	// config routing table
	app.get('/', home);
	app.get('/about', about);
	app.get('/create', getCreate);
	app.get('/edit/:id', getEdit);
	app.get('/details/:id', details);
	app.get('/delete/:id', deleteCube);

	app.post('/edit/:id', postEdit);
	app.post('/create', postCreate);

	app.all('*', notFound);

	app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
})();
