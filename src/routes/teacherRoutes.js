const express = require("express");
const {
  createTeacher,
  getTeachers,
} = require("../controllers/teacherController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", requireAuth, requireRole("SCHOOL_ADMIN"), getTeachers);
router.post("/", requireAuth, requireRole("SCHOOL_ADMIN"), createTeacher);

module.exports = router;
