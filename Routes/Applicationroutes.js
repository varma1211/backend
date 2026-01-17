import express from "express";
import {
  applyJob,
  getAppliedJobsCount,
  getUserAppliedJobs,
  getMyApplications,
} from "../Controllers/ApplicationController.js";
import { authMiddleware } from "../authmiddleware.js ";

const router = express.Router();

router.post("/apply", authMiddleware, applyJob);
router.get("/count", authMiddleware, getAppliedJobsCount);

// 🔹 FOR APPLY BUTTON DISABLE
router.get("/applied-ids", authMiddleware, getUserAppliedJobs);

// 🔹 FOR MY APPLICATIONS PAGE (FULL DATA)
router.get("/my", authMiddleware, getMyApplications);

export default router;
