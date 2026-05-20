const socketIO = require("socket.io");
let io;
const onlineUsers = new Map();

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("addUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("Online Users:", onlineUsers);
    });
    socket.on("sendMessage", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", data);
      }
    });
    socket.on("typing", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", data);
      }
    });
    socket.on("deleteMessage", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", data);
      }
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
module.exports = {
  initSocket,
  getIO,
  onlineUsers,
};
