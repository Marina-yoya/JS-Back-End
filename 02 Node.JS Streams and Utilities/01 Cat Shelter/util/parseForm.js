const formidable = require('formidable'),
	path = require('path'),
	fs = require('fs/promises');

module.exports = async (req) => {
	const form = new formidable.IncomingForm();

	return new Promise((resolve, reject) => {
		form.parse(req, async (err, fields, files) => {
			if (err) return reject(err);
			if (Object.values(files).length === 0) return resolve(fields);

			const tempPath = typeof files.image === 'undefined' ? files.upload.path : files.image.path;
			const fileName = typeof files.image === 'undefined' ? files.upload.name : files.image.name;
			const targetPath = path.join(__dirname, '../static/images', fileName);

			await fs.rename(tempPath, targetPath);

			fields.image = fileName;
			resolve(fields);
		});
	});
};

// Couldn't manage to decode and write correctly the image buffer so my custom decoder it's not used

// const customDecoder = new Promise((resolve, reject) => {
// 	const dataChunks = [];

// 	req.on('data', (chunk) => {
// 		dataChunks.push(chunk);

// 		if (dataChunks.join('').length > 1e6 * 5) {
// 			req.connection.destroy();
// 			return reject('Size is too big!');
// 		}
// 	});

// 	req.on('end', () => {
// 		try {
// 			const extractedData = {};
// 			const rawData = Buffer.concat(dataChunks);
// 			rawData
// 				.toString()
// 				.split('-----------------------------')
// 				.map((e) => e.split(' '))
// 				.map((arr) => {
// 					if (arr.length >= 3) {
// 						const input = arr.find((x) => x.startsWith('name="'));
// 						const inputName = input.split('"')[1];

// 						if (inputName !== 'image') {
// 							const inputValueText = input
// 								.split('"')
// 								.pop()
// 								.split('\n')
// 								.filter((el) => el.length >= 2)[0]
// 								.split('\r')
// 								.shift();

// 							return (extractedData[inputName] = inputValueText);
// 						}

// 						const imageName = arr.find((x) => x.startsWith('filename="')).split('"')[1];
// 						const imageType = imageName.split('.').pop();
// 						const imageBuffer = rawData.toString().split('-----------------------------')[3].slice(165);

// 						extractedData[inputName] = { imageName, imageType, imageBuffer };
// 					}
// 				});

// 			resolve(extractedData);
// 		} catch (err) {
// 			reject(err);
// 		}
// 	});
// });
