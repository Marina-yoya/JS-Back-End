const express = require('express'),
	hbs = require('express-handlebars'),
	cookieParse = require('cookie-parser'),
	authMiddleware = require('../middlewares/auth'),
	storageMiddleware = require('../middlewares/storage');

module.exports = (app) => {
	app.disable('x-powered-by');

	app.set('view engine', 'hbs');
	app.engine('hbs', hbs({ extname: 'hbs' }));

	app.use(express.urlencoded({ extended: true }));
	app.use('/static', express.static('static'));
	app.use(cookieParse());
	app.use(authMiddleware());
	app.use(storageMiddleware());
};