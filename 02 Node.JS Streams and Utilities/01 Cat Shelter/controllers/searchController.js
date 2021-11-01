const path = require('path'),
	fs = require('fs/promises'),
	formParser = require('../util/parseForm'),
	createElement = require('../util/createElement'),
	{ loadTemplate, layout } = require('../util/template');

module.exports = async (req, res) => {
	const catsDataFilePath = path.join(__dirname, '../data/cats.json');

	try {
		const catsDataBuffer = await fs.readFile(catsDataFilePath);
		const catsData = JSON.parse(catsDataBuffer);

		let searchPage = await loadTemplate('home');
		const searchQuery = (await formParser(req)).breed;
		let searchResult = catsData.filter((cat) => cat.breed === searchQuery);

		if (searchResult.length) {
			searchResult = searchResult.map(createElement).join('');
			searchPage = searchPage.replace(new RegExp('{{data}}', 'g'), searchResult);

			res.writeHead(200, { 'Content-Type': 'text/html' });
			return res.end(await layout(searchPage));
		}

		searchPage = searchPage.replace(new RegExp('{{data}}', 'g'), '<h1>No Results Found</h1>');

		res.statusCode = 404;
		res.end(await layout(searchPage));
	} catch (err) {
		res.statusCode = 500;
		res.end(`Error >>> ${err}`);
	}
};
