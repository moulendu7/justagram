const socketIO = require("socket.io");
const User = require("../src/models/User");
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
    socket.on("addUser", async (userId) => {
      onlineUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
      });
      socket.broadcast.emit("userOnline", {
        userId,
      });
      console.log("Online Users:", onlineUsers);
    });
    socket.on("sendMessage", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", data);
      }
    });
    socket.on("messageDelivered", (data) => {
      const senderSocketId = onlineUsers.get(data.senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("messageDelivered", data);
      }
    });
    socket.on("messageSeen", (data) => {
      const senderSocketId = onlineUsers.get(data.senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageSeen", data);
      }
    });
    socket.on("typing", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", data);
      }
    });
    socket.on("stopTyping", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", data);
      }
    });
    socket.on("deleteMessage", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", data);
      }
    });
    socket.on("sendNotification", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveNotification", data);
      }
    });
    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);
    });
    socket.on("leaveGroup", (groupId) => {
      socket.leave(groupId);
    });
    socket.on("sendGroupMessage", (data) => {
      io.to(data.groupId).emit("receiveGroupMessage", data);
    });
    socket.on("callUser", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("incomingCall", {
          callerId: data.callerId,
          callerName: data.callerName,
          callType: data.callType,
        });
      }
    });
    socket.on("acceptCall", (data) => {
      const callerSocketId = onlineUsers.get(data.callerId);

      if (callerSocketId) {
        io.to(callerSocketId).emit("callAccepted", data);
      }
    });
    socket.on("rejectCall", (data) => {
      const callerSocketId = onlineUsers.get(data.callerId);
      if (callerSocketId) {
        io.to(callerSocketId).emit("callRejected");
      }
    });
    socket.on("endCall", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("callEnded");
      }
    });
    socket.on("offer", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("offer", data);
      }
    });
    socket.on("answer", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("answer", data);
      }
    });
    socket.on("iceCandidate", (data) => {
      const receiverSocketId = onlineUsers.get(data.receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("iceCandidate", data);
      }
    });
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date(),
          });
          socket.broadcast.emit("userOffline", {
            userId,
          });
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
