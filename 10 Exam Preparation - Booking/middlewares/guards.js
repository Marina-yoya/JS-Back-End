const isUser = () => (req, res, next) => {
	if (req.user) next();
	else res.redirect('/auth/login');
};

const isGuest = () => (req, res, next) => {
	if (!req.user) next();
	else res.redirect('/');
};

const isOwner = () => async (req, res, next) => {
	const hotel = await req.storage.getHotelById(req.params.id);
	if (req.user._id == hotel.owner) next();
	else res.redirect('/auth/login');
};

module.exports = { isUser, isGuest, isOwner };
