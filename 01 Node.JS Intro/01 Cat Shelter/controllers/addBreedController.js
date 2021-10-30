const fs = require('fs/promises'),
	path = require('path'),
	formParser = require('../util/parseForm'),
	{ loadTemplate, layout } = require('../util/template');

module.exports = async (req, res) => {
	if (req.method === 'GET') {
		const addBreedPage = await loadTemplate('addBreed');
		res.writeHead(200, { 'Content-Type': 'text/html' });
		return res.end(await layout(addBreedPage));
	}

	const breedsDataFilePath = path.join(__dirname, '../data/breeds.json');
	const breedsDataBuffer = await fs.readFile(breedsDataFilePath);
	const breedsData = JSON.parse(breedsDataBuffer);
	breedsData.push((await formParser(req)).breed);

	try {
		await fs.writeFile(breedsDataFilePath, JSON.stringify(breedsData));

		res.writeHead(302, {
			Location: '/',
		});

		res.end();
	} catch (err) {
		res.statusCode = 500;
		res.end(`Error >>> ${err}`);
	}
};
