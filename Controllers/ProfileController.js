import User from "../Models/User.js";
import fs from "fs";
import path from "path";

/* ================= PROFILE COMPLETION LOGIC ================= */
const calculateProfileCompletion = (user) => {
  let score = 0;

  // ===== PERSONAL (20%) =====
  if (
    user.personal?.firstName &&
    user.personal?.phone &&
    user.personal?.location
  ) {
    score += 20;
  }

  // ===== EDUCATION (35%) =====
  if (user.education?.tenth?.institution) score += 15;
  if (user.education?.undergraduate?.institution) score += 20;

  // ===== DOCUMENTS (15%) =====
  // ===== DOCUMENTS (15%) =====
if (
  user.documents?.tenth &&
  user.documents?.intermediate &&
  user.documents?.undergraduate &&
  user.documents?.resume
) {
  score += 15;
}


  // ===== PROJECTS (15%) =====
  if (user.projects?.length > 0) score += 15;

  // ===== EXPERIENCE (15%) =====
  if (user.experience?.length > 0) score += 15;

  return score;
};

/* ===== APPLY COMPLETION HELPER ===== */
const applyProfileCompletion = (user) => {
  user.profileCompletion = calculateProfileCompletion(user);
  user.isProfileCompleted = user.profileCompletion >= 80;
};

/* ================= PERSONAL ================= */
export const updatePersonal = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.personal = req.body;
    applyProfileCompletion(user);

    await user.save();

    res.json({
      message: "Personal details saved",
      profileCompletion: user.profileCompletion,
      isProfileCompleted: user.isProfileCompleted
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



/* ================= DOCUMENTS ================= */
export const updateDocuments = async (req, res) => {
  console.log("FILES RECEIVED:", req.files);

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.files?.tenth) {
      deleteFileIfExists(user.documents.tenth);
      user.documents.tenth = req.files.tenth[0].filename;
    }

    if (req.files?.intermediate) {
      deleteFileIfExists(user.documents.intermediate);
      user.documents.intermediate = req.files.intermediate[0].filename;
    }

    if (req.files?.undergraduate) {
      deleteFileIfExists(user.documents.undergraduate);
      user.documents.undergraduate = req.files.undergraduate[0].filename;
    }

    if (req.files?.resume) {
      deleteFileIfExists(user.documents.resume);
      user.documents.resume = req.files.resume[0].filename;
    }

    applyProfileCompletion(user);
    await user.save();

    res.json({
      message: "Documents uploaded successfully",
      documents: user.documents,
      profileCompletion: user.profileCompletion,
      isProfileCompleted: user.isProfileCompleted
    });
  } catch (error) {
    console.error("DOCUMENT UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};



/* ================= EDUCATION ================= */
export const updateEducation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.education = req.body;
    applyProfileCompletion(user);

    await user.save();

    res.json({
      message: "Education saved",
      profileCompletion: user.profileCompletion,
      isProfileCompleted: user.isProfileCompleted
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= PROJECTS ================= */
export const updateProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.projects = req.body.projects;
    applyProfileCompletion(user);

    await user.save();

    res.json({
      message: "Projects saved",
      profileCompletion: user.profileCompletion,
      isProfileCompleted: user.isProfileCompleted
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= EXPERIENCE ================= */
export const updateExperience = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.experience = req.body.experience;
    applyProfileCompletion(user);

    await user.save();

    res.json({
      message: "Experience saved",
      profileCompletion: user.profileCompletion,
      isProfileCompleted: user.isProfileCompleted
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= GET USER PROFILE ================= */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .lean(); // ✅ read-only, safe

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      personal: user.personal || {},
      documents: user.documents || {},
      education: user.education || {},
      projects: user.projects || [],
      experience: user.experience || [],
      profilePhoto: user.profilePhoto || "",
      profileCompletion: user.profileCompletion || 0,
      isProfileCompleted: user.isProfileCompleted || false
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteFileIfExists = (filename) => {
  if (!filename) return;

  const filePath = path.join("uploads", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};
export const updateProfilePhoto = async (req, res) => {
  console.log("REQ.FILE:", req.file);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    deleteFileIfExists(user.profilePhoto);

    

    res.json({
      message: "Profile photo updated",
      photo: user.profilePhoto
    });
  } catch (error) {
    console.error("PHOTO UPLOAD ERROR:", error);
    res.status(500).json({ message: "Photo upload failed" });
  }
};
