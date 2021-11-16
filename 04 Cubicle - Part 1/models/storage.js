const fs = require('fs/promises'),
	idGenerator = require('uniqid');

// load and parse data file
// provide ability to:
// - read all entries
// - read single entry by ID
// - add new entry
// -- get matching entries by search criteria

// Model structure

/* 
   {
      "name": "string",
      "description": "string",
      "imageUrl": "string",
      "difficulty": "number",
   }
*/

const data = {};

const init = async () => {
	try {
		Object.assign(data, JSON.parse(await fs.readFile('./models/data.json')));
	} catch (err) {
		console.error('Error reading data!');
	}

	return (req, res, next) => {
		req.storage = {
			edit,
			getAll,
			create,
			getById,
			deleteCube,
		};
		next();
	};
};

// The following two functions doesn't need to be asynchronous but
// I've made them to be because when working with actual database the
// functions will be asynchronous so let's create some useful habits. :)
const getAll = async (query) => {
	let cubes = Object.entries(data).map(([id, value]) => Object.assign({}, { id, ...value }));

	// Filter cubes by query params
	if (query.search) {
		cubes = cubes.filter((c) => c.name.toLowerCase().includes(query.search.toLowerCase()));
	}

	if (query.from) {
		cubes = cubes.filter((c) => c.difficulty >= Number(query.from));
	}

	if (query.to) {
		cubes = cubes.filter((c) => c.difficulty <= Number(query.to));
	}

	// In case of no result by a search query
	if (cubes.length === 0 && Object.keys(query).length) {
		cubes.push({ emptySearch: true });
	}

	return cubes;
};

const getById = async (id) => {
	return data[id] ? Object.assign({}, { id, ...data[id] }) : undefined;
};

const create = async (cube) => {
	const newID = idGenerator();
	data[newID] = cube;
	await saveData();
};

const edit = async (id, cube) => {
	if (data[id] === undefined) {
		throw new ReferenceError('No such ID in database!');
	}

	data[id] = cube;
	await saveData();
};

const deleteCube = async (id) => {
	delete data[id];
	await saveData();
};

const saveData = async () => {
	try {
		await fs.writeFile('./models/data.json', JSON.stringify(data, null, 2));
	} catch (err) {
		console.error('Error writing out data!');
	}
};

module.exports = {
	init,
	edit,
	getAll,
	create,
	getById,
	deleteCube,
};
