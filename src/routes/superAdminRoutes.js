const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  listSchools,
  toggleSchoolStatus,
  listUsersBySchool,
  toggleUserStatus
} = require("../controllers/superAdminController");

const router = express.Router();

/**
 * 🔐 SUPER ADMIN PROTECTION
 * All routes below this middleware require:
 * - Valid JWT
 * - Role = SUPER_ADMIN
 */
router.use(requireAuth, requireRole("SUPER_ADMIN"));

/**
 * 🩺 Health Check (for testing & debugging)
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

// Get all schools
// GET /api/super-admin/schools
router.get("/schools", listSchools);

// Activate / Deactivate a school
// PATCH /api/super-admin/schools/:id/status
router.patch("/schools/:id/status", toggleSchoolStatus);

/**
 * 👥 User Management
 */

// Get all users of a specific school
// GET /api/super-admin/schools/:id/users
router.get("/schools/:id/users", listUsersBySchool);

// Activate / Deactivate a user
// PATCH /api/super-admin/users/:id/status
router.patch("/users/:id/status", toggleUserStatus);

module.exports = router;
