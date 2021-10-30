const path = require('path'),
	fs = require('fs/promises');

module.exports = async (req, res) => {
	try {
		const dataFilePath = path.join(__dirname, '../data/cats.json');
		const catsDataBuffer = await fs.readFile(dataFilePath);
		let catsData = JSON.parse(catsDataBuffer);
		const id = req.url.split('=').pop();

		// The request comes from existing element with a unique ID
		// so I won't do further validations on the object.
		const index = catsData.findIndex((e) => e.id === id);
		const imageFilePath = path.join(__dirname, '../static/images', catsData[index].image);

		catsData[index] = null;
		catsData = catsData.filter(Boolean);
		// Remove falsy values

		await fs.rm(imageFilePath);
		await fs.writeFile(dataFilePath, JSON.stringify(catsData));

		res.writeHead(302, {
			Location: '/',
		});

		res.end();
	} catch (err) {
		res.statusCode = 500;
		res.end(`Error >>> ${err}`);
	}
};
