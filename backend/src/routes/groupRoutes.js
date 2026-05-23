const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  createGroup,
  getUserGroups,
  sendGroupMessage,
  getGroupMessages,
  addMember,
  removeMember,
  promoteAdmin,
  leaveGroup,
  deleteGroup,
  addModerator,
  removeModerator,
  muteUser,
  toggleAdminOnlyMessages,
} = require("../controllers/groupController");
const router = express.Router();

router.post("/", protect, createGroup);
router.get("/", protect, getUserGroups);
router.post("/message/:groupId", protect, sendGroupMessage);
router.get("/message/:groupId", protect, getGroupMessages);
router.put("/add-member/:groupId", protect, addMember);
router.put("/remove-member/:groupId", protect, removeMember);
router.put("/promote-admin/:groupId", protect, promoteAdmin);
router.put("/leave/:groupId", protect, leaveGroup);
router.delete("/:groupId", protect, deleteGroup);
router.put("/add-moderator/:groupId", protect, addModerator);
router.put("/remove-moderator/:groupId", protect, removeModerator);
router.put("/mute/:groupId", protect, muteUser);
router.put("/admin-only/:groupId", protect, toggleAdminOnlyMessages);

module.exports = router;
