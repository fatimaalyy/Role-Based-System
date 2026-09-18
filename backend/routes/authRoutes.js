const express = require("express");
const router = express.Router();
const { registerSuperAdmin, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register-superadmin", registerSuperAdmin);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
