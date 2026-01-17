import express from "express";
import {
  downloadJobsExcel,
  downloadApplicationsExcel,
  downloadStudentDatabase
} from "../Controllers/AdminDownloadController.js";
import { authMiddleware, adminOnly } from "../authmiddleware.js ";

const router = express.Router();

router.get("/jobs", authMiddleware, adminOnly, downloadJobsExcel);
router.get("/applications", authMiddleware, adminOnly, downloadApplicationsExcel);
router.get("/students", authMiddleware, adminOnly, downloadStudentDatabase);


export default router;
