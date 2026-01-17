import express from "express";
import { getAdminDashboard } from "../Controllers/AdminDashboardController.js";
import { authMiddleware,adminOnly } from "../authmiddleware.js ";

const router = express.Router();

// router.get("/dashboard", adminAuth, getAdminDashboard);
router.get("/dashboard", authMiddleware, adminOnly, getAdminDashboard);


export default router;
