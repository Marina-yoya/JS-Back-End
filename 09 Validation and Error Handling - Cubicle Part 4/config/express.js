const express = require('express'),
  hbs = require('express-handlebars'),
  auth = require('../middlewares/auth'),
  cookieParser = require('cookie-parser');

module.exports = (app) => {
  app.disable('x-powered-by');

  // Config view engine
  app.engine('hbs', hbs({ extname: 'hbs' }));
  app.set('view engine', 'hbs');

  // Set middlewares
  app.use('/static', express.static('static'));
  app.use('/scripts', express.static('scripts'));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(auth());
};
