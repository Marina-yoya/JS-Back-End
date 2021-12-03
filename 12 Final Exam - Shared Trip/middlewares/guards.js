const isAuth = () => (req, res, next) => {
	if (req.user) next();
	else res.redirect('/auth/login');
};

const isGuest = () => (req, res, next) => {
	if (!req.user) next();
	else res.redirect('/');
};

const isOwner = () => async (req, res, next) => {
	try {
		const trip = await req.storage.getTripById(req.params.id);
		if (req.user._id == trip.author._id) next();
		else res.redirect('/auth/login');
	} catch (err) {
		res.render('404');
	}
};

module.exports = { isAuth, isGuest, isOwner };
