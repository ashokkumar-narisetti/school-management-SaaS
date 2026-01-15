const express = require("express");
const { createStudent } = require("../controllers/studentController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(express.json());
router.post("/", requireAuth, createStudent);

module.exports = router;
