const Trip = require('../models/Trip');
const User = require('../models/User');

const getAllTrips = () => {
	return Trip.find({}).lean();
};

const createTrip = async (tripData) => {
	const trip = new Trip(tripData);
	const user = await User.findById(tripData.author._id);
	user.trips.push(trip);

	await Promise.all([trip.save(), user.save()]);

	return trip;
};

const getTripById = (id) => {
	return Trip.findById(id).populate('author').populate('companions').lean();
};

const editTrip = async (id, tripData) => {
	const trip = await Trip.findById(id);
	Object.assign(trip, tripData);

	await trip.save();
};

const joinTrip = async (tripId, userId) => {
	const trip = await Trip.findById(tripId);
	const user = await User.findById(userId);

	trip.seats -= 1;
	trip.companions.push(user);

	await trip.save();
};

const deleteTrip = async (id) => {
	await Trip.findByIdAndDelete(id);
};

module.exports = { getAllTrips, createTrip, getTripById, editTrip, deleteTrip, joinTrip };
