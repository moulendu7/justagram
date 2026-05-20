const express = require("express");

const protect = require(
  "../middleware/authMiddleware"
);

const {
  addComment,
  getComments,
} = require(
  "../controllers/commentController"
);

const router = express.Router();

router.post(
  "/:videoId",
  protect,
  addComment
);

router.get(
  "/:videoId",
  protect,
  getComments
);

module.exports = router;