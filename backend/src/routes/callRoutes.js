const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createCallLog,
  getCallHistory,
} = require("../controllers/callController");
const checkBlock = require("../middleware/blockMiddleware");
const router = express.Router();

router.post("/", protect, checkBlock, createCallLog);
router.get("/", protect, getCallHistory);

module.exports = router;
