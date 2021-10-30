const path = require('path'),
	fs = require('fs/promises'),
	createElement = require('../util/createElement'),
	{ loadTemplate, layout } = require('../util/template');

module.exports = async (req, res) => {
	try {
		const catsDataBuffer = await fs.readFile(path.join(__dirname, '../data/cats.json'));
		const catsData = JSON.parse(catsDataBuffer).map(createElement).join('');

		let homePage = await loadTemplate('home');
		homePage = homePage.replace(new RegExp('{{data}}', 'g'), catsData);

		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(await layout(homePage));
	} catch (err) {
		res.statusCode = 500;
		res.end(`Error >>> ${err}`);
	}
};
