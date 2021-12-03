const { TOKEN_SECRET, COOKIE_NAME } = require('../config'),
  userService = require('../services/user'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');

module.exports = () => (req, res, next) => {
  req.auth = { login, register, logout };

  if (readToken(req)) next();

  async function login({ username, password }) {
    if ((username.trim() === '', password.trim() === '')) {
      throw new Error('All fields are required!');
    }

    const user = await userService.getUserByUsername(username.trim());
    const passwordMatch = await bcrypt.compare(password, user?.hashedPassword);

    if (!user || !passwordMatch) {
      throw new Error('Wrong username or password!');
    }

    res.user = createToken(user);
  }

  async function register({ username, password, repeatPassword }) {
    if (username.trim() === '' || password.trim() === '' || repeatPassword.trim() === '') {
      throw new Error('All fields are required!');
    } else if (password !== repeatPassword) {
      throw new Error("Passwords don't match!");
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const user = await userService.createUser({ username: username.trim(), hashedPassword });

    req.user = createToken(user);
  }

  function logout() {
    res.clearCookie(COOKIE_NAME);
  }

  function createToken(user) {
    const userViewModel = { _id: user._id, username: user.username };
    const token = jwt.sign(userViewModel, TOKEN_SECRET);
    res.cookie(COOKIE_NAME, token, { httpOnly: true });

    return userViewModel;
  }

  function readToken(req) {
    const token = req.cookies.SESSION_DATA;

    if (token) {
      try {
        const userData = jwt.verify(token, TOKEN_SECRET);
        req.user = userData;

        res.locals.user = userData; // Stores global values that handlebars can read.
      } catch (err) {
        res.clearCookie(COOKIE_NAME);
        res.redirect('/auth/login');
        return false;
      }
    }

    return true;
  }
};
