const express = require("express");
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getProfile,
  getAllProfiles,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", protect, getProfile);
router.get("/users", getAllProfiles);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
