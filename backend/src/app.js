const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");
const saveRoutes = require("./routes/saveRoutes");
const searchRoutes = require("./routes/searchRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const activityRoutes = require("./routes/activityRoutes");
const messageRoutes = require("./routes/messageRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const groupRoutes = require("./routes/groupRoutes");
const blockRoutes = require("./routes/blockRoutes");
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/saves", saveRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/block", blockRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
