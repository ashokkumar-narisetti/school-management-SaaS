const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  listSchools,
  toggleSchoolStatus,
  listUsersBySchool,
  toggleUserStatus,
  getAuditLogs
} = require("../controllers/superAdminController");

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
 * 🏫 Schools
 */
router.get("/schools", listSchools);
router.patch("/schools/:id/status", toggleSchoolStatus);

/**
 * 👥 Users
 */
router.get("/schools/:id/users", listUsersBySchool);
router.patch("/users/:id/status", toggleUserStatus);

/**
 * 🧾 Audit Logs
 */
router.get("/audit-logs", getAuditLogs);

module.exports = router;
