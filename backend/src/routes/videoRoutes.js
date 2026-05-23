const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadVideo,
  getFeed,
  toggleLike,
  deleteVideo,
  incrementView,
  incrementShare,
  getTrendingVideos,
  getExploreVideos,
} = require("../controllers/videoController");
const router = express.Router();
router.post("/upload", protect, upload.single("video"), uploadVideo);
router.get("/feed", protect, getFeed);
router.put("/like/:id", protect, toggleLike);
router.delete("/:id", protect, deleteVideo);
router.put("/view/:id", protect, incrementView);
router.put("/share/:id", protect, incrementShare);
router.get("/trending", protect, getTrendingVideos);
router.get("/explore", protect, getExploreVideos);

module.exports = router;
