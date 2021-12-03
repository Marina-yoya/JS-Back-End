const express = require('express'),
	authMiddleware = require('../middlewares/auth'),
	corsMiddleware = require('../middlewares/cors');

module.exports = (app) => {
	app.disable('x-powered-by');

	app.use(express.json());
	app.use(corsMiddleware());
	app.use(authMiddleware());
};
