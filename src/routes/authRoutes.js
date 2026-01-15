const express = require("express");
const { login, changePassword } = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/change-password", requireAuth, changePassword);

module.exports = router;
