const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getConversations,
  resetUnreadCount,
} = require("../controllers/conversationController");
const router = express.Router();

router.get("/", protect, getConversations);
router.put("/reset/:id", protect, resetUnreadCount);

module.exports = router;
