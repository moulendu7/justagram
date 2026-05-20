const Activity = require("../models/Activity");

const getUserActivity = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user._id,
    })
      .populate("video", "videoUrl caption")
      .populate("targetUser", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const clearActivity = async (req, res) => {
  try {
    await Activity.deleteMany({
      user: req.user._id,
    });

    res.status(200).json({
      message: "Activity cleared",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getUserActivity,
  clearActivity,
};
