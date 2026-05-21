const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  sendMessage,
  getConversation,
  markAsSeen,
  deleteMessageForEveryone,
} = require("../controllers/messageController");
const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:userId", protect, getConversation);
router.put("/seen/:id", protect, markAsSeen);
router.delete("/:id", protect, deleteMessageForEveryone);
router.put("/reaction/:id", protect, reactToMessage);

module.exports = router;
