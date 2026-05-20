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
module.exports = router;
