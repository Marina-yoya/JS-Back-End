// Sessions are stored on the server, cookies are stored on the client.
// Cookies can't work across different domains.

const app = require('express')(),
	sessions = {},
	PORT = 5000;

// Middleware for managing the sessions
function sessionStorage(req, res, next) {
	let session = {};

	if (req.headers.cookie) {
		// Get cookies if any
		const id = req.headers.cookie.split('=')[1];

		if (sessions[id]) {
			// If known user is visiting we load his session
			session = sessions[id];
			console.log('>>> Existing session', session);
		} else {
			console.log('>>> Invalid session cookie, generating a new one');
			createSession();
		}
	} else {
		createSession();
	}

	req.session = session;
	next();

	function createSession() {
		const id = ('00000000' + ((Math.random() * 99999999) | 0).toString(16)).slice(-8);
		session.visited = 0;
		sessions[id] = session;

		// Set cookies
		res.setHeader('Set-Cookie', `sessionID=${id}`);
		res.setHeader('Second-Cookie', `secondCookie`);
		console.log('New user, generating session with ID', id);
	}
}

// Middleware for managing sessions
app.use(sessionStorage);

app.get('/', (req, res) => {
	req.session.visited++;
	res.send(`<h1>Hello</h1><p style="font-size: 40px" >Your session data is: <br> ${JSON.stringify(req.session)}</p>`);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
