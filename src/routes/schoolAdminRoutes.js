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

/**
 * 🔐 School Admin protection
 */
router.use(requireAuth, requireRole("SCHOOL_ADMIN"));

/**
 * 🏫 School profile
 * GET /api/school-admin/profile
 */
router.get("/profile", getSchoolProfile);

/**
 * 👥 Users (all users of school)
 * GET /api/school-admin/users
 */
router.get("/users", async (req, res, next) => {
  try {
    const prisma = require("../prisma");
    const users = await prisma.user.findMany({
      where: { schoolId: req.user.schoolId },
      select: {
        id: true,
        username: true,
        role: true,
        active: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * 👨‍🏫 Teachers
 */
router.get("/teachers", listTeachers);
router.post("/teachers", createTeacher);
router.patch("/teachers/:id/status", toggleTeacherStatus);

/**
 * 🏫 Classes
 */
router.get("/classes", listClasses);
router.post("/classes", createClass);

module.exports = router;
