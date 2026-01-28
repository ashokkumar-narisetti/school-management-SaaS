const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { postHomework } = require("../controllers/homeworkController");

const router = express.Router();

router.post("/", requireAuth, requireRole("TEACHER"), postHomework);

module.exports = router;
