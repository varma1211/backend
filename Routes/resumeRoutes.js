import express from "express";
import { uploadResume } from "../Controllers/ResumeController.js";
import { authMiddleware } from "../authmiddleware.js";
import upload from "../uploadResume.js"; // ✅ DEFAULT import

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"), // ✅ NOW THIS WORKS
  uploadResume
);

export default router;
