import User from "../Models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sendEmail  from "../sendmail.js";

/* ================= PASSWORD UTILS ================= */

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

const isStrongPassword = (password) => passwordRegex.test(password);

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ================= REGISTER USER ================= */
export const registerUser = async (req, res, next) => {
  try {
    let { name, email, age, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    email = email.toLowerCase().trim();

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      age,
      password: hashedPassword,
      role: "user",
      isProfileCompleted: false
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

/* ================= LOGIN USER ================= */
export const loginUser = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (err) {
    next(err);
  }
};

/* ================= FORGOT PASSWORD (OTP) ================= */
/* ================= RESET PASSWORD WITH OTP ================= */
/* ================= FORGOT PASSWORD (OTP) ================= */
/* ================= FORGOT PASSWORD (SEND OTP) ================= */

export const forgotPasswordOTP = async (req, res) => {
  try {
    let { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.resetPasswordOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    /* 🔐 EMAIL MUST NOT CRASH API */
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset OTP",
        html: `
          <h2>TalentBridge Password Reset</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        `
      });
    } catch (emailErr) {
      console.error("❌ OTP email failed:", emailErr.message);

      return res.status(500).json({
        message: "Failed to send OTP email. Please try again later."
      });
    }

    return res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

/* ================= RESET PASSWORD WITH OTP ================= */

export const resetPasswordWithOTP = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase().trim();

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number & special character"
      });
    }

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await User.findOne({
      email,
      resetPasswordOTP: hashedOTP,
      resetPasswordOTPExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Password reset successful",
      token
    });

  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
/* ================= GET USER PROFILE ================= */
/* ================= GET USER PROFILE ================= */
// UserController.js
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password"); // ❌ only password removed

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // ✅ FULL USER OBJECT
  } catch (error) {
    console.error("getUserProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};





/* ================= UPDATE USER PROFILE ================= */
export const updateUserProfile = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { ...req.body, isProfileCompleted: true },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    next(err);
  }
};
