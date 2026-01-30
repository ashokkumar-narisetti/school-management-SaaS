const express = require("express");
const {
  createSchool,
  getAllSchools,
  getSchoolUsers,
  updateSchoolStatus,
} = require("../controllers/schoolController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * GET all schools
 */
router.get(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  getAllSchools
);

/**
 * GET users of a school
 */
router.get(
  "/:schoolId/users",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  getSchoolUsers
);

/**
 * UPDATE school status
 */
router.patch(
  "/:schoolId/status",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  updateSchoolStatus
);

/**
 * CREATE school
 */
router.post(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  createSchool
);

module.exports = router;
