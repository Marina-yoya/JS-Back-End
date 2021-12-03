// init
(async () => {
  const PORT = 5000,
    app = require('express')(),
    storage = require('./middlewares/storage');

  app.use(storage());

  await require('./config/database')(app);
  require('./config/express')(app);
  require('./config/routs')(app);

  app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
})();