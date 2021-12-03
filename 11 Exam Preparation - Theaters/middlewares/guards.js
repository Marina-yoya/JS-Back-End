const isAuth = () => (req, res, next) => {
	if (req.user) next();
	else res.redirect('/auth/login');
};

const isGuest = () => (req, res, next) => {
	if (!req.user) next();
	else res.redirect('/');
};

const isAuthor = () => async (req, res, next) => {
	try {
		const play = await req.storage.getPlayById(req.params.id);
		if (req.user._id == play.author._id) next();
		else res.redirect('/auth/login');
	} catch (err) {
		res.render('404');
	}
};

module.exports = { isAuth, isGuest, isAuthor };
