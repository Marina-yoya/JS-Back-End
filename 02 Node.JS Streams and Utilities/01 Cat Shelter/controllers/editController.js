const path = require('path'),
	fs = require('fs/promises'),
	formParser = require('../util/parseForm'),
	{ loadTemplate, layout } = require('../util/template');

module.exports = async (req, res) => {
	const id = req.url.split('=').pop();
	const catsDataFilePath = path.join(__dirname, '../data/cats.json');
	const breedsDataFilePath = path.join(__dirname, '../data/breeds.json');

	try {
		const catsDataBuffer = await fs.readFile(catsDataFilePath);
		const breedsDataBuffer = await fs.readFile(breedsDataFilePath);

		let breedsData = JSON.parse(breedsDataBuffer);
		let catsData = JSON.parse(catsDataBuffer);

		// The request comes from existing element with a unique ID
		// so I won't do any further validations on the object.
		const target = catsData.find((e) => e.id === id);
		const targetIndex = catsData.indexOf(target);

		if (req.method === 'POST') {
			const formData = await formParser(req);

			if (formData.image !== target.image) {
				const currentImageFilePath = path.join(__dirname, '../static/images', target.image);
				await fs.rm(currentImageFilePath);
			}

			Object.assign(catsData[targetIndex], formData);
			await fs.writeFile(catsDataFilePath, JSON.stringify(catsData));

			res.writeHead(302, {
				Location: '/',
			});

			res.end();
		} else {
			let editPage = await loadTemplate('edit');

			editPage = editPage.replace(
				new RegExp('{{options}}', 'g'),
				breedsData
					.filter((breed) => breed !== target.breed)
					.map((breed) => `<option value="${breed}">${breed}</option>`)
			);

			Object.entries(target).map(([key, value]) => (editPage = editPage.replace(new RegExp(`{{${key}}}`, 'g'), value)));

			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(await layout(editPage));
		}
	} catch (err) {
		res.statusCode = 500;
		res.end(`Error >>> ${err}`);
	}
};
