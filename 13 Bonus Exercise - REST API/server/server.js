const app = require('express')(),
	{ PORT } = require('./config'),
	routesConfig = require('./config/routes'),
	expressConfig = require('./config/express'),
	databaseConfig = require('./config/database');

void async function () {
	await 
	databaseConfig(app);
	expressConfig(app);
	routesConfig(app);

	app.listen(PORT, () => console.log(`REST Service running on port ${PORT}...`));

	app.get('/', (req, res) => res.send("REST Service operational. Send requests to the host's addresses."));
}();
