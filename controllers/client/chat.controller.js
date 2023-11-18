const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
	const userId = res.locals.user.id;
	const fullName = res.locals.user.fullName;

	_io.once("connection", (socket) => {
		socket.on("CLIENT_SEND_MESSAGE", async (content) => {
			const chat = new Chat({
				user_id: userId,
				content
			});
			await chat.save();

			_io.emit("SERVER_RETURN_MESSAGE", {
				userId: userId,
				fullName: fullName,
				content: content
			});
		});

		socket.on("CLIENT_SEND_TYPING", async (type) => {
			socket.broadcast.emit("SERVER_RETURN_TYPING", {
				userId: userId,
				fullName: fullName,
				type: type
			});
		});
	});

	const chats = await Chat.find({
		deleted: false
	});

	for (const chat of chats) {
		const infoUser = await User.findOne({
			_id: chat.user_id
		}).select("fullName");

		chat.infoUser = infoUser;
	}

	res.render("clients/pages/chat/index", {
		titlePage: "Chat",
		chats: chats
	});
}