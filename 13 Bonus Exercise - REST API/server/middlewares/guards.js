const isAuth = () => (req, res, next) => {
	if (req.user) next();
	else res.status(401).json({ message: 'Sign in first.' });
};

const isGuest = () => (req, res, next) => {
	if (!req.user) next();
	else res.status(400).json({ message: 'Already authorized.' });
};

const isOwner = () => (req, res, next) => {
	const record = req.data;

	if (req.user && req.user._id == record.owner) next();
	else res.status(403).json({ message: 'Access denied.' });
};

module.exports = { isAuth, isGuest, isOwner };
