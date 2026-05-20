const express = require("express");
const protect = require("../middleware/authMiddleware");
const { searchAll } = require("../controllers/searchController");
const router = express.Router();
router.get("/", protect, searchAll);

module.exports = router;
