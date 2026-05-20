const express = require("express");
const protect = require("../middleware/authMiddleware");
const { toggleSave, getSavedVideos } = require("../controllers/saveController");
const router = express.Router();

router.post("/:videoId", protect, toggleSave);
router.get("/", protect, getSavedVideos);

module.exports = router;
