const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  blockUser,
  unblockUser,
  getBlockedUsers,
} = require("../controllers/blockController");
const router = express.Router();

router.get("/", protect, getBlockedUsers);
router.post("/:userId", protect, blockUser);
router.delete("/:userId", protect, unblockUser);

module.exports = router;
