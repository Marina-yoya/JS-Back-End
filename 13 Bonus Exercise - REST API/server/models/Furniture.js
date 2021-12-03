const { Schema, model } = require('mongoose');

const schema = new Schema({
	material: { type: String },
	owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },

	price: {
		type: Number,
		required: [true, 'Price is required.'],
		min: [0.1, 'Price must be a positive number.'],
	},

	type: {
		type: String,
		required: [true, 'Type is required.'],
		minLength: [3, 'Type must be at least 3 characters long.'],
	},

	description: {
		type: String,
		required: [true, 'Description is required.'],
		minLength: [10, 'Description must be at least 10 characters long.'],
	},

	img: {
		type: String,
		required: [true, 'Image is required.'],
		// validate: {
		// 	validator: (v) => {
		// 		if (v.toLowerCase().substr(0, 8) === 'https://' || v.toLowerCase().substr(0, 7) === 'http://') return true;
		// 		else return false;
		// 	},
		// 	message: (props) => `${props.value} is not a valid url.`,
		// },
	},
});

module.exports = model('Furniture', schema);
