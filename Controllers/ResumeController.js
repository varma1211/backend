import { extractText } from "../utils/extractText.js";
import { calculateATSScore } from "../utils/atsScore.js";
import fs from "fs";

export const uploadResume = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume file required" });
    }

    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({ message: "Job description required" });
    }

    // 1️⃣ Extract resume text
    const resumeText = await extractText(
      req.file.path,
      req.file.mimetype
    );

    // 2️⃣ Calculate ATS
    const atsResult = calculateATSScore(resumeText, jobDescription);

    // 3️⃣ Delete uploaded resume (no storage)
    fs.unlink(req.file.path, () => {});

    // ✅ 4️⃣ SEND MISSING SKILLS + SUGGESTIONS
    return res.status(200).json({
      atsScore: atsResult.score,
      missingSkills: atsResult.missingSkills,
      suggestions: atsResult.suggestions
    });

  } catch (error) {
    console.error("ATS ERROR:", error);
    return res.status(500).json({ message: "ATS analysis failed" });
  }
};
