import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Shortlisted", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

// ❌ Prevent applying twice for same job
applicationSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
