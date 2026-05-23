const Video = require("../models/Video");
const Save = require("../models/Save");

const updateEngagementScore = async (videoId) => {
  const video = await Video.findById(videoId);
  if (!video) return;
  const saveCount = await Save.countDocuments({
    video: videoId,
  });
  const score =
    video.likes.length * 3 +
    video.comments.length * 5 +
    video.shares * 7 +
    video.views * 1 +
    saveCount * 10;

  video.engagementScore = score;

  await video.save();
};

module.exports = updateEngagementScore;
