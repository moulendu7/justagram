const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const Video = require("../models/Video");
const Comment = require("../models/Comment");
const Activity = require("../models/Activity");

const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No video uploaded",
      });
    }
    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "reels",
          },

          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    const video = await Video.create({
      caption: req.body.caption,

      videoUrl: result.secure_url,

      publicId: result.public_id,

      user: req.user._id,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const videos = await Video.find()
      .populate("user", "username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalVideos = await Video.countDocuments();

    res.status(200).json({
      currentPage: page,

      totalPages: Math.ceil(totalVideos / limit),
      totalVideos,
      videos,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const incrementView = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }
    video.views += 1;
    await Activity.create({
      user: req.user._id,
      type: "view",
      video: video._id,
    });
    await video.save();
    res.status(200).json({
      message: "View counted",
      views: video.views,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const toggleLike = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }
    const alreadyLiked = video.likes.includes(req.user._id);
    if (alreadyLiked) {
      video.likes.pull(req.user._id);
      await video.save();
      return res.status(200).json({
        message: "Video unliked",
      });
    }
    video.likes.push(req.user._id);
    await Activity.create({
      user: req.user._id,
      type: "like",
      video: video._id,
    });
    await video.save();
    res.status(200).json({
      message: "Video liked",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }
    if (video.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    await cloudinary.uploader.destroy(video.publicId, {
      resource_type: "video",
    });
    await Comment.deleteMany({
      video: video._id,
    });
    await video.deleteOne();

    res.status(200).json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const incrementShare = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }
    video.shares += 1;
    await Activity.create({
      user: req.user._id,
      type: "share",
      video: video._id,
    });
    await video.save();
    res.status(200).json({
      message: "Share counted",

      shares: video.shares,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  uploadVideo,
  getFeed,
  toggleLike,
  deleteVideo,
  incrementView,
  incrementShare,
};
