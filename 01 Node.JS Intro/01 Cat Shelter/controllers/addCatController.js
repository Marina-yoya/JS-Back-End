const path = require('path'),
	fs = require('fs/promises'),
	idGenerator = require('../util/createID'),
	formParser = require('../util/parseForm'),
	{ loadTemplate, layout } = require('../util/template');

module.exports = async (req, res) => {
	const breedsDataFilePath = path.join(__dirname, '../data/breeds.json');
	const catsDataFilePath = path.join(__dirname, '../data/cats.json');

	try {
		const breedsDataBuffer = await fs.readFile(breedsDataFilePath);
		const catsDataBuffer = await fs.readFile(catsDataFilePath);

		const breedsData = JSON.parse(breedsDataBuffer);
		const catsData = JSON.parse(catsDataBuffer);

		if (req.method === 'GET') {
			let addCatPage = await loadTemplate('addCat');
			addCatPage = addCatPage.replace(
				new RegExp('{{options}}', 'g'),
				breedsData.map((breed) => `<option value="${breed}">${breed}</option>`)
			);

			res.writeHead(200, { 'Content-Type': 'text/html' });
			return res.end(await layout(addCatPage));
		}

		const data = await formParser(req);
		data.id = await idGenerator();
		catsData.unshift(data);

		await fs.writeFile(catsDataFilePath, JSON.stringify(catsData));

		res.writeHead(302, {
			Location: '/',
		});

		res.end();
	} catch (err) {
		res.statusCode = 500;
		res.end(`Error >>> ${err}`);
	}
};
