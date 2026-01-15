const express = require("express");
const { createClass } = require("../controllers/classController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ THIS IS CRITICAL
router.use(express.json());

router.post("/", requireAuth, createClass);

module.exports = router;
