const mongoose = require('mongoose'),
	{ DB_CONNECTION_STRING } = require('./');

module.exports = (app) => {
	// I'm using a promise because the following actions are asynchronous and I want
	// the application to start only when and if the connection is established successfully.
	return new Promise((resolve, reject) => {
		mongoose.connect(DB_CONNECTION_STRING, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		const db = mongoose.connection;

		db.on('error', (err) => {
			console.error(`Database error: ${err.message}`);
			reject(err);
		});

		db.on('open', () => {
			console.error('Database connected...');
			resolve();
		});
	});
};
