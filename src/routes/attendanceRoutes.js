const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { markAttendance } = require("../controllers/attendanceController");

const router = express.Router();

router.post(
  "/mark",
  requireAuth,
  requireRole("TEACHER"),
  markAttendance
);

module.exports = router;
