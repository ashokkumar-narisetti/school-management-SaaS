const express = require("express");
const { createTeacher } = require("../controllers/teacherController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ ENSURE JSON IS PARSED
router.use(express.json());

router.post("/", requireAuth, createTeacher);

module.exports = router;
