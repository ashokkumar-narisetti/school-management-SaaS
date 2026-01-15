const express = require("express");
const { markAttendance } = require("../controllers/attendanceController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(express.json());
router.post("/", requireAuth, markAttendance);

module.exports = router;
