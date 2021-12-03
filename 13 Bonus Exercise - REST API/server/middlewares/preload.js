const { getById } = require('../services/furniture'),
	parseError = require('../util/parsers');

module.exports = () => async (req, res, next) => {
	try {
		const record = await getById(req.params.id);
		if (!record) throw new Error('Not found.');
		req.data = record;
	} catch (err) {
		// const message = parseError(err);
		res.status(404).json({ message: 'Not found.' });
	}

	next();
};
