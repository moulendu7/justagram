const Video = require("../models/Video");
const Save = require("../models/Save");

const getAnalyticsOverview = async (req, res) => {
  try {
    const videos = await Video.find({
      user: req.user._id,
    });
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalEngagement = 0;
    const videoIds = videos.map((video) => video._id);
    const totalSaves = await Save.countDocuments({
      video: {
        $in: videoIds,
      },
    });
    videos.forEach((video) => {
      totalViews += video.views;
      totalLikes += video.likes.length;
      totalComments += video.comments.length;
      totalShares += video.shares;
      totalEngagement += video.engagementScore;
    });
    const engagementRate =
      totalViews > 0 ? ((totalEngagement / totalViews) * 100).toFixed(2) : 0;
    res.status(200).json({
      totalVideos: videos.length,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      totalSaves,
      engagementRate,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTopVideos = async (req, res) => {
  try {
    const videos = await Video.find({
      user: req.user._id,
    })
      .sort({
        engagementScore: -1,
      })
      .limit(10);
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  getAnalyticsOverview,
  getTopVideos,
};
