const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  sendMessage,
  getConversation,
  markAsSeen,
  deleteMessageForEveryone,
  searchMessages,
  togglePinMessage,
  reactToMessage
} = require("../controllers/messageController");
const checkBlock = require("../middleware/blockMiddleware");

const router = express.Router();

router.post("/", protect, checkBlock, sendMessage);
router.get("/:userId", protect, getConversation);
router.put("/seen/:id", protect, markAsSeen);
router.delete("/:id", protect, deleteMessageForEveryone);
router.put("/reaction/:id", protect, reactToMessage);
router.get("/search/query", protect, searchMessages);
router.put("/pin/:id", protect, togglePinMessage);

module.exports = router;
