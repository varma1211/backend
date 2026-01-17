import express from "express";
import { getDashboardStats } from "../Controllers/DashboardController.js";
import { authMiddleware } from "../authmiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getDashboardStats);
router.get("/dashboard", authMiddleware, getDashboardStats);

export default router;
