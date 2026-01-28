const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { getParentHomework } = require("../controllers/parentHomeworkController");

const router = express.Router();

router.get("/", requireAuth, requireRole("PARENT"), getParentHomework);

module.exports = router;
