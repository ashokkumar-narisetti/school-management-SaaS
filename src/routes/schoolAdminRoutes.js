const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  getSchoolProfile,
  listTeachers,
  createTeacher,
  toggleTeacherStatus,
  listClasses,
  createClass
} = require("../controllers/schoolAdminController");

const router = express.Router();

router.use(requireAuth, requireRole("SCHOOL_ADMIN"));

router.get("/profile", getSchoolProfile);

router.get("/teachers", listTeachers);
router.post("/teachers", createTeacher);
router.patch("/teachers/:id/status", toggleTeacherStatus);

router.get("/classes", listClasses);
router.post("/classes", createClass);

module.exports = router;
