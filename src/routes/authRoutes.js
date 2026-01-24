const express = require("express");
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", authController.login);
router.post(
  "/change-password",
  requireAuth,
  authController.changePassword
);

module.exports = router;
