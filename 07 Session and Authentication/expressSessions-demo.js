// Sessions are stored on the server, cookies are stored on the client.
// Cookies don't work between different domains.

const expressSession = require('express-session'),
	cookieParse = require('cookie-parser'),
	express = require('express'),
	app = express(),
	sessions = {},
	PORT = 5000;

// Middleware for managing the sessions
function sessionStorage(req, res, next) {
	let session = {};

	console.log(req.cookies.sessionID && sessions[req.cookies.sessionID]);

	if (req.cookies.sessionID && sessions[req.cookies.sessionID]) {
		// Get cookies if any
		const id = req.cookies.sessionID;
		// If known user is visiting we load his session
		session = sessions[id];
		console.log('>>> Existing session', session);
	} else {
		createSession();
	}

	req.session = session;
	next();

	function createSession() {
		const id = ('00000000' + ((Math.random() * 99999999) | 0).toString(16)).slice(-8);
		session.visited = 0;
		sessions[id] = session;

		// Set cookies using 'cookie-parser'
		res.cookie('sessionID', id);
		console.log('New user, generating session with ID', id);
	}
}

// Middleware for managing cookies
app.use(cookieParse());
// Middleware for managing sessions
app.use(sessionStorage);
// Middleware for managing sessions (from express)
app.use(
	// The module 'express session' have it's own cookie parser so using both
	//  parsers with 'secret' enabled will possibly create conflict! We may only want
	// to keep session id in the cookies and the rest of the data to be on the server.
	expressSession({
		secret: 'some-secret-key',
		// 'secret' is generating cryptographic key.
		resave: false,
		// 'resave' overwrite the session event if it hasn't been
		// changed and raise condition can happen when working with database!
		saveUninitialized: false,
		// If 'uninitialized' is set to true a session automatically will be created.
		// Forces a session that is 'uninitialized' to be saved to the store.
		// A session is uninitialized when it is new but not modified. Choosing false
		// is useful for implementing login sessions, reducing server storage usage,
		// or complying with laws that require permission before setting a cookie.
		// Choosing false will also help with race conditions where a client makes
		// multiple parallel requests without a session.
		cookie: { secure: false, httpOnly: true },
		// 'secure' enables it to work with https protocol only.
		// 'httpOnly' disables the possibility of the client to edit/read the cookies.
	})
);

app.get('/', (req, res) => {
	// Get cookies if any
	console.log(req.cookies); // { sessionID: '02a10b83' }

	req.session.visited++;
	res.send(`<h1>Hello</h1><p style="font-size: 40px" >Your session data is: <br> ${JSON.stringify(req.session)}</p>`);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
