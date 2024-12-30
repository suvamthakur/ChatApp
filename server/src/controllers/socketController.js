const { getUserChats } = require("./userController");

const socketController = (io) => {
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    console.log("uId: ", userId);
    const userChats = await getUserChats({ user: { _id: userId } }, null);
    userChats.forEach((chat) => {
      socket.join(chat._id);
    });
    socket.join(userId); // In future we can get this user's socket because of this room

    // New chat created
    socket.on("create_chat", (chatId, users) => {
      // Join admin to the room (chatId)
      socket.join(chatId);

      // Join all users to the room (chatId)
      users.forEach((user) => {
        io.to(user._id).socketsJoin(chatId);
        io.to(user._id).emit("chat_created");
      });
    });

    // Add new users to a chat(group)
    socket.on("add_user_to_group", (chatId, userIdList) => {
      socket.to(chatId).emit("added_into_group"); // notify all the existing users of this chat room
      userIdList.forEach((userId) => {
        io.to(userId).socketsJoin(chatId); // add all user sockets to `chatId` room
        io.to(userId).emit("added_into_group");
      });
    });

    socket.on("disconnect", () => {
      userChats.forEach((chat) => {
        socket.leave(chat._id);
      });
      socket.leave(userId);
    });
  });
};

module.exports = socketController;

// // Remove user from a group
// socket.on("remove_user", (chatId, userId) => {
//   console.log(chatId);
//   io.to(chatId).emit("user_removed", chatId, userId);
// });
