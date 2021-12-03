const parseError = (err) => {
	console.error(err.message);

	if (err.name === 'ValidationError') {
		return Object.values(err.errors)
			.map((e) => e.properties.message)
			.join('\n');
	}

	return err.message;
};

module.exports = parseError;
