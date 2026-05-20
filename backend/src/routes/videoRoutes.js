const express = require("express");
const protect = require(
  "../middleware/authMiddleware"
);
const upload = require(
  "../middleware/uploadMiddleware"
);
const {
  uploadVideo,
  getFeed,
  toggleLike,
  deleteVideo
} = require(
  "../controllers/videoController"
);
const router = express.Router();
router.post(
  "/upload",
  protect,
  upload.single("video"),
  uploadVideo
);
router.get(
  "/feed",
  protect,
  getFeed
);
router.put(
  "/like/:id",
  protect,
  toggleLike
);
router.delete(
  "/:id",
  protect,
  deleteVideo
);
module.exports = router;