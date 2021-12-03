module.exports = (app) => {
	app.all('*', (req, res, next) => {
		if (req.url !== '/favicon.ico') {
			console.log('Url >>> ', req.url);
			console.log('Body >>> ', req.body);
			console.log('Method >>> ', req.method);
			console.log('Session >>> ', req.session);
		}

		next();
	});

	app.get('/', (req, res) => {
		if (req.session.user) {
			res.send(layout('', `Welcome ${req.session.user.username}`));
			return;
		}

		res.send(layout('', 'Welcome guest'));
	});

	app.get('/login', (req, res) => {
		res.send(
			layout(
				`
   <form action="/login" method="POST" style="display: flex; flex-direction: column; align-items: start" >
   <label for="username">Username: <input type="text" name="username"> </label>
   <label for="password">Password: <input type="password" name="password"> </label>
   <input type="submit" value="Log in">
   </form>
   `,
				'Login'
			)
		);
	});

	app.get('/register', (req, res) => {
		res.send(
			layout(
				`
   <form action="/register" method="POST" style="display: flex; flex-direction: column; align-items: start" >
   <label for="username">Username: <input type="text" name="username"> </label>
   <label for="password">Password: <input type="password" name="password"> </label>
   <label for="rePass">Repeat Password: <input type="password" name="rePass"> </label>
   <input type="submit" value="Register">
   </form>
   `,
				'Register'
			)
		);
	});
};

function layout(html, title) {
	return `
   <h1>${title}</h1>
   <a href="/">Home</a> <br>
   <a href="/login">Login</a> <br> 
   <a href="/register">Register</a>
   <br>
   <br>
 
   ${html}
   `;
}
