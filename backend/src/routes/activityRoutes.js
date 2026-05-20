const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getUserActivity,
  clearActivity,
} = require("../controllers/activityController");
const router = express.Router();
router.get("/", protect, getUserActivity);

router.delete("/clear", protect, clearActivity);

module.exports = router;
