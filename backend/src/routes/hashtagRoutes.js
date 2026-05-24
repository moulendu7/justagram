const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getTrendingHashtags,
  getVideosByHashtag,
} = require("../controllers/hashtagController");
const router = express.Router();

router.get("/trending", protect, getTrendingHashtags);
router.get("/:tag", protect, getVideosByHashtag);

module.exports = router;
