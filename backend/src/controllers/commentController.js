const Comment = require("../models/Comment");

const Video = require("../models/Video");

const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const video = await Video.findById(
      req.params.videoId
    );

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const comment = await Comment.create({
      text,
      user: req.user._id,
      video: video._id,
    });

    video.comments.push(comment._id);

    await video.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      video: req.params.videoId,
    })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addComment,
  getComments,
};