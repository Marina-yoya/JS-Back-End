const path = require('path'),
	fs = require('fs/promises');

module.exports = async () => {
	const IDList = [];

	const catsDataBuffer = await fs.readFile(path.join(__dirname, '../data/cats.json'));
	JSON.parse(catsDataBuffer.toString()).map((c) => IDList.push(c.id));

	let newId = (Math.random() * 150).toString().slice(5);

	do {
		newId = (Math.random() * 150).toString().slice(5);
	} while (IDList.includes(newId));

	return newId;
};
