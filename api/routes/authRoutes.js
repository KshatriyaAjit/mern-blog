import express from "express";
import {
  GoogleLogin,
  Login,
  Logout,
  Register,
  Me,
  UpdateProfile,
  updatePassword,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// 🔹 Auth routes
router.post("/register", Register);                     // User registration
router.post("/login", Login);                           // Email-password login
router.post("/google-login", GoogleLogin);              // Google OAuth login
router.post("/logout", authenticate, Logout);           // Secure logout

// ✅ Added profile-related routes
router.get("/me", authenticate, Me);                    // Get current user profile
router.put("/update-profile", authenticate, upload.single("avatar"), UpdateProfile); // Update name, email, avatar
router.put("/update-password", authenticate, updatePassword); // Change password

export default router;
