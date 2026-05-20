const Save = require("../models/Save");
const Video = require("../models/Video");
const Activity = require("../models/Activity");

const toggleSave = async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const existingSave = await Save.findOne({
      user: req.user._id,
      video: video._id,
    });
    if (existingSave) {
      await existingSave.deleteOne();

      return res.status(200).json({
        message: "Video unsaved",
      });
    }

    const save = await Save.create({
      user: req.user._id,
      video: video._id,
    });
    await Activity.create({
      user: req.user._id,
      type: "save",
      video: video._id,
    });
    res.status(201).json({
      message: "Video saved",

      save,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getSavedVideos = async (req, res) => {
  try {
    const savedVideos = await Save.find({
      user: req.user._id,
    })
      .populate({
        path: "video",

        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json(savedVideos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  toggleSave,
  getSavedVideos,
};
