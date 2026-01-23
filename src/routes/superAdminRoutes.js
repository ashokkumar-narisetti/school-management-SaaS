const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  listSchools,
  toggleSchoolStatus,
  listUsersBySchool,
  toggleUserStatus
} = require("../controllers/superAdminController");

const router = express.Router();

// SUPER ADMIN ONLY
router.use(requireAuth, requireRole("SUPER_ADMIN"));

router.get("/schools", listSchools);
router.patch("/schools/:id/status", toggleSchoolStatus);

router.get("/schools/:id/users", listUsersBySchool);
router.patch("/users/:id/status", toggleUserStatus);

module.exports = router;
