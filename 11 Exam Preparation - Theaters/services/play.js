const Play = require('../models/Play');
const User = require('../models/User');

const getAllPlays = (sortBy = 'dateDescending') => {
	const sortCriteria = {
		byLikes: { userLikes: -1 },
		dateAscending: { createdAt: 1 },
		dateDescending: { createdAt: -1 },
	};

	return Play.find({ public: true }).sort(sortCriteria[sortBy]).lean();
};

const getPlayById = (id) => {
	return Play.findById(id).populate('author').populate('userLikes').lean();
};

const getPlayByTitle = (title) => {
	const pattern = new RegExp(`^${title}$`, 'i');
	return Play.findOne({ title: { $regex: pattern } });
};

const createPlay = async (playData) => {
	const play = new Play(playData);
	await play.save();

	return play;
};

const editPlay = async (playData, id) => {
	let play = await Play.findById(id);
	Object.assign(play, playData);
	await play.save();

	return play;
};

const likePlay = async (playId, userId) => {
	const [play, user] = await Promise.all([Play.findById(playId), User.findById(userId)]);
	play.userLikes.push(user);
	user.likedPlays.push(play);
	await Promise.all([play.save(), user.save()]);

	return play;
};

const deletePlay = async (id) => {
	await Play.findByIdAndDelete(id);
};

module.exports = { getAllPlays, getPlayByTitle, getPlayById, createPlay, editPlay, likePlay, deletePlay };
