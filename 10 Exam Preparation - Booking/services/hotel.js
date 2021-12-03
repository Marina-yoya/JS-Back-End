const User = require('../models/User');
const Hotel = require('../models/Hotel');

const getAllHotels = async () => {
	return await Hotel.find({}).lean();
};

const getHotelById = async (id) => {
	return await Hotel.findById(id).populate('bookedBy').lean();
};

const createHotel = async (hotelData, userId) => {
	const user = await User.findById(userId);
	const hotel = new Hotel(hotelData);
	user.offeringHotels.push(hotel);
	await Promise.all([hotel.save(), user.save()]);
};

const editHotel = async (hotelData, id) => {
	const hotel = await Hotel.findById(id);
	Object.assign(hotel, hotelData);
	await hotel.save();
};

const bookHotel = async (userId, hotelId) => {
	const [hotel, user] = await Promise.all([Hotel.findById(hotelId), User.findById(userId)]);
	hotel.bookedBy.push(user);
	user.reservations.push(hotel);
	await Promise.all([hotel.save(), user.save()]);
};

const deleteHotel = async (id) => {
	await Hotel.findByIdAndDelete(id);
};

module.exports = { createHotel, getAllHotels, getHotelById, bookHotel, editHotel, deleteHotel };
