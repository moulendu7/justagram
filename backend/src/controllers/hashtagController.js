const Hashtag = require("../models/Hashtag");
const Video = require("../models/Video");

const getTrendingHashtags = async (req, res) => {
  try {
    const hashtags = await Hashtag.find()
      .sort({
        usageCount: -1,
      })
      .limit(20);
    res.status(200).json(hashtags);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getVideosByHashtag = async (req, res) => {
  try {
    const tag = `#${req.params.tag.toLowerCase()}`;
    const videos = await Video.find({
      hashtags: tag,
    })
      .populate("user", "username avatar")
      .sort({
        engagementScore: -1,
      });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTrendingHashtags,
  getVideosByHashtag,
};
