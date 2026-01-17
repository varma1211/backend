import express from "express";
import {
  getAdminApplications,
  getSingleApplication,
  updateApplicationStatus,
  rejectApplication,
  getApplicationsCountByJob
} from "../Controllers/AdminApplicationController.js";

import { authMiddleware, adminOnly } from "../authmiddleware.js ";

const router = express.Router();

/* ===============================
   ADMIN APPLICATION ROUTES
================================ */

// GET all applications
router.get("/applications", authMiddleware, adminOnly, getAdminApplications);

// GET single application (view 👁)
router.get(
  "/applications/:id",
  authMiddleware,
  adminOnly,
  getSingleApplication
);

// UPDATE application status
router.put(
  "/applications/:id/status",
  authMiddleware,
  adminOnly,
  updateApplicationStatus
);

// REJECT application (optional shortcut)
router.put(
  "/applications/:id/reject",
  authMiddleware,
  adminOnly,
  rejectApplication
);

// APPLICATION COUNT PER JOB
router.get(
  "/applications-count",
  authMiddleware,
  adminOnly,
  getApplicationsCountByJob
);

export default router;
