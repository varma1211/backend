import express from "express";
import { createJob ,getAllJobs,getLatestJobs,getTodayJobCount} from "../Controllers/JobsController.js";
import { authMiddleware, adminOnly } from "../authmiddleware.js";


const router = express.Router();

// Admin posts job
router.post("/post", authMiddleware, adminOnly, createJob);
router.get("/", getAllJobs);
router.get("/latest", getLatestJobs);
router.get("/today-count", getTodayJobCount);


export default router;
