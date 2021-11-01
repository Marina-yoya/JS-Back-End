const fs = require('fs/promises');

module.exports = async (req, res) => {
	const fileLocation = req.url.slice(8);
	let type = req.url.split('.').pop();
	type = type === 'css' ? 'text/css' : type;

	try {
		const file = await fs.readFile(`./static/${fileLocation}`);

		res.writeHead(200, { 'Content-Type': type });
		res.end(file);
	} catch (err) {
		res.statusCode = 500;
		res.end(`Error >>> ${err}`);
	}
};
