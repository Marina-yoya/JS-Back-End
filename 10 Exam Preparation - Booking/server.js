const app = require('express')(),
	{ PORT } = require('./config'),
	routesConfig = require('./config/routes'),
	expressConfig = require('./config/express'),
	databaseConfig = require('./config/database');

// init
(async () => {
	await databaseConfig(app);
	expressConfig(app);
	routesConfig(app);

	app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
})();
