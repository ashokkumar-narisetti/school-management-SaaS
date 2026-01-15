const express = require("express");
const { createSchool } = require("../controllers/schoolController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("SUPER_ADMIN"),
  createSchool
);

module.exports = router;
