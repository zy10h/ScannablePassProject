const express = require("express");
const UserController = require("../controllers/authController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// Auth
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Profile
router.get("/profile/:id", protect, UserController.getProfile);
router.put("/profile", protect, UserController.updateUserProfile);
router.get("/users", UserController.getAllProfiles);

// ✅ New QR code route
router.get("/qrcode", protect, UserController.getQRCode);

module.exports = router;
