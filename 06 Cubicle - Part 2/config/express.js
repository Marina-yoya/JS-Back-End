const express = require('express'),
  hbs = require('express-handlebars');

module.exports = (app) => {
  // Config view engine
  app.engine(
    'hbs',
    hbs({
      extname: '.hbs',
    })
  );

  app.set('view engine', 'hbs');

  // Set middlewares
  app.use('/static', express.static('static'));
  app.use('/scripts', express.static('scripts'));
  app.use(express.urlencoded({ extended: false }));
};
