// Brief Express Demo

const express = require('express'),
	app = express(),
	PORT = 5000;

// There is automatically generated header in the response where it says
// that the server is done with express, therefore for security purposes
// we can remove it simply by saying:
app.disable('x-powered-by');

// Or with middleware will look like that:
app.use((req, res, next) => {
	res.removeHeader('X-Powered-By');
	next();
});

/////////////////////////////////////////////////////////////////////////
// Routes

app.get('/', (req, res) => {
	res.send('Hello World');
	// Streams are automatically ended once the response is done.
});

app.get('/about', (req, res) => {
	// If we register two handlers/actions on the same request method
	// and on the same route only the first one is registered!
	res.send('Ignoring following handles on the same http method and route');
});

app.get('/user/:userID', (req, res) => {
	const params = req.params;
	res.send("User's id " + params.userID);
});

app.post('/catalog', (req, res) => {
	res.status(201);
	res.send('Article created');
});

/////////////////////////////////////////////////////////////////////////
// Redirect

app.get('/about/old-page', (req, res) => {
	res.status(302);
	res.redirect('/about');
});

/////////////////////////////////////////////////////////////////////////
// Chaining handlers/actions

app
	.route('/catalog')

	.get((req, res) => {
		res.send('Catalog page');
	})

	.post((req, res) => {
		res.status(201);
		res.send('Article created');
	});

// Modular router is the most preferred option mostly for
// performance optimization, that way we don't initialize
// all modules at once but rather when we need them.

/////////////////////////////////////////////////////////////////////////
// Modular router -> go to catalog.js for demo code.

const catalogRouter = require('./catalog');
app.use(catalogRouter);

/////////////////////////////////////////////////////////////////////////
// Middlewares demo
// Middlewares can be chained indefinitely as long as the previous one calls "next"

// Can be used on Application level
const middleware = require('./middleware');

// For certain route
app.get('/', middleware, (req, res) => {
	res.send('Middleware');
});

// Globally
app.use(middleware);

// Can be used for error handling - with four parameters!
// It has to be declared at the end!
// !! Can't automatically catch errors from asynchronous functions without
// additional libraries, which is not very good practice as they modify
// the prototype of Express and if there is more than one libraries that
// modifies the prototype that can be pain in the ars!
app.use((err, req, res, next) => {
	console.log(err.stack);
	if (err instanceof HttpError) {
		res.status(error.statusCode).json(err.data);
	} else {
		res.sendStatus(httpResponseCodes.INTERNAL_SERVER_ERROR);
	}
});

// Third part middlewares example
app.set('views engine', 'pug');
app.set('views', __dirname + '/views');

app.use(cookieParser());
app.use(session({ secret: 'The end of the rainbow' }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/static', express.static('public'));
// etc.

/////////////////////////////////////////////////////////////////////////
// 'All' method

app.all('/about', (req, res) => {
	// app.all on a route matches all HTTP methods towards it.
	res.send('Matching all HTTP methods >>> ' + req.method);
});

app.all('*', (req, res) => {
	// * Matches everything.
	// Can be used nested as well - app.all(/catalog/*/details)
	// We might wanna use app.all for the custom 404 page,
	// rather than that there is no such a wide use of it.
	// If 'all' method is used, we obviously want to place it as a final handler.
	res.status(404);
	res.send('404 Not Found');
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
