const express = require("express");
const { getHomeworkForParent } = require("../controllers/parentHomeworkController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getHomeworkForParent);

module.exports = router;
