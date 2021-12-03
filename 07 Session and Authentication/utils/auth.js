const bcrypt = require('bcrypt'),
	users = {};

module.exports = (req, res, next) => {
	req.register = async (username, password) => {
		const passwordHash = await bcrypt.hash(password, 8);
		const id = ('00000000' + ((Math.random() * 99999999) | 0).toString(16)).slice(-8);

		users[id] = {
			username,
			passwordHash,
		};

		console.log('New user', users);
		res.redirect('/login');
	};

	req.login = async (username, password) => {
		const user = Object.values(users).find((u) => u.username === username);

		if (user) {
			const passwordMatch = (await bcrypt.compare(password, user.passwordHash)) || null;

			if (passwordMatch) {
				// login success
				req.session.user = {
					username,
					_id: user.id,
				};
				res.redirect('/');
			} else {
				res.send(403, "Username or password don't match any user in our database!");
			}
		} else {
			res.send(403, "Username or password don't match any user in our database!");
		}
	};

	next();
};
