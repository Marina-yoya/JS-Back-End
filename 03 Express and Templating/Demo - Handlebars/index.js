const express = require('express'),
	hbs = require('express-handlebars'),
	app = express(),
	PORT = 5000;

// express-handlebars rather than just handlebars it's
// sort of a packed as it can be used as a middleware from express.

app.engine(
	'hbs', // file's extension is set here so express can recognize it.
	hbs({
		// layoutsDir: 'main'
		// defaultLayout: 'index'
		extname: '.hbs', // file's extension is set here so handlebars can recognize it.
	})
);
// Templates folder structure by default is required
// to be as it's shown here in the demo but can be set to other preferences
// Layout is the root, filled usually with headers, navigation, footers, etc.

// The fonder 'views' can be set to another with the following settings:
// app.set('views', 'templates');

// The folder 'layouts' can be set to another with the settings
// on line 9 and the main template with the settings on line 10.

app.set('view engine', 'hbs');
// Required only if we don't include the file's extension
// down in the response as it's shown here in the demo.

app.get('/', (req, res) => {
	const demoData = {
		name: 'Demo',
		email: 'demo@yahoo.com',
		itemsObject: { pocket: 'Lint' },
		itemsArray: ['wallet', 'coins', 'keys'],
		user: { username: 'John' },
	};
	res.render('home', demoData); // templating engine will look for the passed values
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
