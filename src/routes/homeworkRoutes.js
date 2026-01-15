const express = require("express");
const { createHomework } = require("../controllers/homeworkController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(express.json());
router.post("/", requireAuth, createHomework);

module.exports = router;
