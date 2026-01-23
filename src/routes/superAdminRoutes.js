const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  listSchools,
  toggleSchoolStatus,
  listUsersBySchool,
  toggleUserStatus
} = require("../controllers/superAdminController");
const prisma = require("../prisma");

const router = express.Router();

/**
 * 🔐 SUPER ADMIN PROTECTION
 */
router.use(requireAuth, requireRole("SUPER_ADMIN"));

/**
 * 🩺 Health Check
 * GET /api/super-admin/health
 */
router.get("/health", (req, res) => {
  res.json({
    ok: true,
    role: req.user.role,
    message: "Super Admin API is healthy"
  });
});

/**
 * 🏫 School Management
 */
router.get("/schools", listSchools);
router.patch("/schools/:id/status", toggleSchoolStatus);

/**
 * 👥 User Management
 */
router.get("/schools/:id/users", listUsersBySchool);
router.patch("/users/:id/status", toggleUserStatus);

/**
 * 📜 Audit Logs
 * GET /api/super-admin/audit-logs
 */
router.get("/audit-logs", async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        actor: {
          select: { id: true, username: true }
        }
      }
    });

    res.json(logs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
