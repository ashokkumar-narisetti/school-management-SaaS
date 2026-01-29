const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const controller = require("../controllers/superAdminController");

const router = express.Router();

/**
 * 🔐 Super Admin protection
 */
router.use(requireAuth, requireRole("SUPER_ADMIN"));

/**
 * Schools
 */
router.get("/schools", controller.listSchools);
router.post("/schools", controller.createSchool);
router.patch("/schools/:id/status", controller.toggleSchoolStatus);

/**
 * Users
 */
router.get("/schools/:id/users", controller.listSchoolUsers);
router.patch("/users/:id/status", controller.toggleUserStatus);

/**
 * Audit logs
 */
router.get("/audit-logs", controller.getAuditLogs);

module.exports = router;
