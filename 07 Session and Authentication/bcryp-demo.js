const bcrypt = require('bcrypt');

// Bcrypt functions are asynchronous!

const saltRounds = 10;
const password = 'pass1'; // $2b$10$z3j2DSCIwbe94yKmf1pnzeBY.Z2h.uaWn07/uNRpsxgyAB0.KZ1oW

const encrypt = async () => {
	// const salt = await bcrypt.genSalt(saltRounds);
	// const hash = await bcrypt.hash(password, salt);

	// Or we can use salt rounds as the second parameter of the 'hash' method.
	const hash = await bcrypt.hash(password, saltRounds);

	console.log('hash >>> ', hash);
	// console.log('salt >>> ', salt);
};

const decrypt = async (hash) => {
	const result = await bcrypt.compare(password, hash);
	console.log('result >>> ', result);
};

encrypt();
decrypt('$2b$10$z3j2DSCIwbe94yKmf1pnzeBY.Z2h.uaWn07/uNRpsxgyAB0.KZ1oW'); // true
