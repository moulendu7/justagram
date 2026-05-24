const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getAnalyticsOverview,
  getTopVideos,
} = require("../controllers/analyticsController");

const router = express.Router();

router.get("/overview", protect, getAnalyticsOverview);
router.get("/top-videos", protect, getTopVideos);

module.exports = router;
