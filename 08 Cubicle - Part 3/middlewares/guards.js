const isAuth = () => (req, res, next) => {
  if (req.user) next();
  else res.redirect('/auth/login');
};

const isGuest = () => (req, res, next) => {
  if (req.user === undefined) next();
  else res.redirect('/products');
};

const isOwner = () => (req, res, next) => {
  if (req.data.cube && req.user && (req.data.cube.ownerId == req.user._id)) next();
  else res.redirect('/auth/login');
};

module.exports = { isAuth, isGuest, isOwner };
