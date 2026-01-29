const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const controller = require("../controllers/schoolAdminController");

const router = express.Router();

/**
 * 🔐 SCHOOL ADMIN PROTECTION
 */
router.use(requireAuth, requireRole("SCHOOL_ADMIN"));

/**
 * 🏫 School profile
 */
router.get("/profile", controller.getSchoolProfile);

/**
 * 👨‍🏫 Teachers
 */
router.get("/teachers", controller.listTeachers);
router.post("/teachers", controller.createTeacher);
router.patch("/teachers/:id/status", controller.toggleTeacherStatus);

/**
 * 🏫 Classes
 */
router.get("/classes", controller.listClasses);
router.post("/classes", controller.createClass);

/**
 * 👨‍🎓 Students + Parents
 */
router.get("/students", controller.listStudents);
router.post("/students", controller.createStudent);
router.patch("/students/:id/status", controller.toggleStudentStatus);

module.exports = router;
