const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const controller = require("../controllers/teacherController");

const router = express.Router();

/**
 * 🔐 TEACHER PROTECTION
 */
router.use(requireAuth, requireRole("TEACHER"));

/**
 * 👤 Profile
 */
router.get("/profile", controller.getProfile);

/**
 * 🏫 Classes & Students
 */
router.get("/classes", controller.getClasses);
router.get("/students", controller.getStudents);

/**
 * 🗓️ Attendance
 */
router.post("/attendance", controller.markAttendance);

/**
 * 📚 Homework
 */
router.post("/homework", controller.postHomework);

/**
 * 📝 Marks
 */
router.post("/marks", controller.addMarks);

module.exports = router;
