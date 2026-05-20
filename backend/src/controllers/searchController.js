const User = require("../models/User");
const Video = require("../models/Video");

const searchAll = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        message: "Search query required",
      });
    }
    const users = await User.find({
      username: {
        $regex: query,
        $options: "i",
      },
    }).select("username avatar bio");
    const videos = await Video.find({
      caption: {
        $regex: query,
        $options: "i",
      },
    })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      users,

      videos,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  searchAll,
};
