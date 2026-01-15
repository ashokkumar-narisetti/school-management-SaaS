const express = require("express");
const { addMark, getMarksForParent } = require("../controllers/marksController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(express.json());

// Teacher adds marks
router.post("/", requireAuth, addMark);

// Parent views marks
router.get("/parent", requireAuth, getMarksForParent);

module.exports = router;
