import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },

    // ONLY THESE 3
    sector: {
      type: String,
      enum: ["Government", "IT", "Non-IT"],
      required: true,
    },

    jobType: { type: String, required: true },
    location: { type: String, required: true },
    salary: String,
    experience: String,
    skills: [String],
    description: { type: String, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
