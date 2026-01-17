import express from "express";
import {
  registerUser,
  loginUser,
  updateUserProfile,
  forgotPasswordOTP,
  resetPasswordWithOTP
} from "../Controllers/UserController.js";
import {
  getUserProfile
} from "../Controllers/ProfileController.js";


import { authMiddleware } from "../authmiddleware.js ";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/me", authMiddleware, updateUserProfile);

// ✅ FIXED HERE
router.post("/forgot-password", forgotPasswordOTP);
router.post("/reset-password-otp", resetPasswordWithOTP);

export default router;
