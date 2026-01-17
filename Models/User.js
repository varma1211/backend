import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ===== AUTH =====
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    age: Number,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    lastLogin: Date,

    // ===== PROFILE STATUS =====
    isProfileCompleted: {
      type: Boolean,
      default: false
    },

    profileCompletion: {
      type: Number,
      default: 0
    },

    // ===== PERSONAL =====
    personal: {
      firstName: String,
      lastName: String,
      phone: String,
      address: String,
      location: String
    },

    // ===== DOCUMENTS =====
    documents: {
      tenth: String,
      intermediate: String,
      undergraduate: String,
      resume: String,
    },
    profilePhoto: String,

    // ===== EDUCATION =====
    education: {
      tenth: {
        institution: String,
        year: Number,
        percentage: Number
      },
      intermediate: {
        institution: String,
        year: Number,
        percentage: Number
      },
      undergraduate: {
        institution: String,
        year: Number,
        percentage: Number
      },
      postgraduate: {
        institution: String,
        year: Number,
        percentage: Number
      }
    },

    // ===== PROJECTS =====
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        duration: String
      }
    ],

    // ===== EXPERIENCE =====
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String
      }
    ],

    // ===== FORGOT PASSWORD =====
    resetPasswordOTP: String,
    resetPasswordOTPExpire: Date
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
