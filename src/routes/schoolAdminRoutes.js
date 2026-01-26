const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const prisma = require("../prisma");

const router = express.Router();

/**
 * 🔐 School Admin protection
 */
router.use(requireAuth, requireRole("SCHOOL_ADMIN"));

/**
 * 👥 Get all users of this school
 * GET /api/school-admin/users
 */
router.get("/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        schoolId: req.user.schoolId
      },
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

module.exports = router;
