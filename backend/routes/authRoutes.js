import express from "express";
import protect from "../middleware/authMiddleware.js";
import UserController from "../controllers/authController.js";

const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile", protect, UserController.getProfile);
router.put("/profile", protect, UserController.updateUserProfile);
router.get("/users", protect, UserController.getAllProfiles);
router.put("/edit-users/:id", protect, UserController.updateUser);
router.delete("/delete-users/:id", protect, UserController.deleteUser);
router.get("/qrcode", protect, UserController.getQRCode);

export default router;
