import express from "express";
import {
  updatePersonal,
  updateDocuments,
  updateEducation,
  updateProjects,
  updateExperience,
  getUserProfile,
  updateProfilePhoto
} from "../Controllers/ProfileController.js";

import { authMiddleware } from "../authmiddleware.js ";
import { uploadDocs, uploadImage } from "../upload.js";



const router = express.Router();

router.get("/", authMiddleware, getUserProfile);

router.put("/personal", authMiddleware, updatePersonal);


router.put(
  "/documents",
  authMiddleware,
  uploadDocs.fields([
    { name: "tenth", maxCount: 1 },
    { name: "intermediate", maxCount: 1 },
    { name: "undergraduate", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateDocuments
);
router.put(
  "/photo",
  authMiddleware,
  uploadImage.single("photo"),
  updateProfilePhoto
);

router.put("/education", authMiddleware, updateEducation);
router.put("/projects", authMiddleware, updateProjects);
router.put("/experience", authMiddleware, updateExperience);

export default router;
