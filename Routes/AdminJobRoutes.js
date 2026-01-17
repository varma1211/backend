import express from "express";
import { getAdminJobs } from "../Controllers/AdminJobController.js";
import { authMiddleware, adminOnly } from "../authmiddleware.js ";

const router = express.Router();

router.get("/jobs", authMiddleware, adminOnly, getAdminJobs);

export default router;
