const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  createGroup,
  getUserGroups,
  sendGroupMessage,
  getGroupMessages,
} = require("../controllers/groupController");
const router = express.Router();

router.post("/", protect, createGroup);
router.get("/", protect, getUserGroups);
router.post("/message/:groupId", protect, sendGroupMessage);
router.get("/message/:groupId", protect, getGroupMessages);

module.exports = router;
