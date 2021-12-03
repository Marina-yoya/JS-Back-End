// HTTP -> Cookies -> Sessions -> Security
// Each enhance the previous one.

// Example of very simple hashing algorithm:
// 'abc' =>  97 * 98 * 99 = (941094).toString(16) = 'e5c26'
// (sort of a pure function)

const expressSession = require('express-session'),
	routs = require('./utils/authenticationControllers'),
	bodyParser = require('express').urlencoded,
	app = require('express')(),
	auth = require('./utils/auth'),
	PORT = 5000;

app.use(auth);
app.use(bodyParser({ extended: false }));
app.use(
	expressSession({
		resave: false,
		secret: 'some-secret-key',
		saveUninitialized: true,
		// For educational purposes I always want a session.
		cookie: { secure: false },
	})
);

routs(app);

app.post('/login', async (req, res) => req.login(req.body.username, req.body.password));
app.post('/register', async (req, res) => req.register(req.body.username, req.body.password));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
