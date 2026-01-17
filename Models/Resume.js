import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    jobDescription: {
      type: String,
      required: true
    },

    atsScore: {
      type: Number,
      required: true
    },

    matchedSkills: {
      type: [String],
      default: []
    },

    missingSkills: {
      type: [String],
      default: []
    },

    suggestions: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
