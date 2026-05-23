const express = require("express");

const protect = require("../middleware/authMiddleware");
const checkBlock = require("../middleware/blockMiddleware");
const {
  getMe,
  getUserProfile,
  updateProfile,
  followUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/:id", protect, getUserProfile);
router.put("/profile", protect, updateProfile);
router.put("/follow/:userId", protect, checkBlock, followUser);

module.exports = router;
