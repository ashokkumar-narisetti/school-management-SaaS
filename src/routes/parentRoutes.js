const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  getParentProfile,
  getMyChildren,
  getChildAttendance,
  getChildHomework,
  getChildMarks
} = require("../controllers/parentController");

const router = express.Router();

/**
 * 🔐 Parent protection
 */
router.use(requireAuth, requireRole("PARENT"));

/**
 * 👤 Parent profile
 * GET /api/parent/profile
 */
router.get("/profile", getParentProfile);

/**
 * 👶 My children
 * GET /api/parent/children
 */
router.get("/children", getMyChildren);

/**
 * 📅 Attendance
 * GET /api/parent/attendance/:studentId
 */
router.get("/attendance/:studentId", getChildAttendance);

/**
 * 📚 Homework
 * GET /api/parent/homework/:studentId
 */
router.get("/homework/:studentId", getChildHomework);

/**
 * 📝 Marks
 * GET /api/parent/marks/:studentId
 */
router.get("/marks/:studentId", getChildMarks);

module.exports = router;
