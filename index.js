import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./dbConfig.js";
import { logger, errorHandle } from "./authmiddleware.js";

// Routes
import userRoutes from "./Routes/Userroutes.js";
import adminRoutes from "./Routes/Adminroutes.js";
import jobRoutes from "./Routes/Jobsroutes.js";
import profileRoutes from "./Routes/Profileroutes.js";
import applicationRoutes from "./Routes/Applicationroutes.js";
import dashboardRoutes from "./Routes/DashboardRoutes.js";
import resumeRoutes from "./Routes/resumeRoutes.js";
import adminDashboardRoutes from "./Routes/AdminDashboardRoutes.js";
import adminJobRoutes from "./Routes/AdminJobRoutes.js";
import adminApplicationRoutes from "./Routes/AdminApplicationRoutes.js";
import adminDownloadRoutes from "./Routes/AdminDownloadRoutes.js";
import chatbotRoutes from "./Routes/chatbot.js";

// Load environment variables
dotenv.config();

const app = express();

/* ===============================
   CORS CONFIG (Vercel Frontend)
================================ */
app.use(
  cors({
    origin: ["https://talentbridge-w5gm.vercel.app", "http://localhost:5173"],
    credentials: true
  })
);

/* ===============================
   MIDDLEWARE
================================ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

/* ===============================
   ROUTES
================================ */
app.use("/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/jobs", jobRoutes);
app.use("/users/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/uploads", express.static(path.join("uploads")));

app.use("/api/admin", adminDashboardRoutes);
app.use("/api/admin", adminJobRoutes);
app.use("/api/admin", adminApplicationRoutes);
app.use("/api/admin/download", adminDownloadRoutes);

app.use("/chatbot", chatbotRoutes);

/* ===============================
   HEALTH CHECK (OPTIONAL BUT GOOD)
================================ */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* ===============================
   ERROR HANDLER
================================ */
app.use(errorHandle);

/* ===============================
   START SERVER (RAILWAY)
================================ */
const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
    
  })
  .catch((err) => {
    console.error("❌ DB Connection Failed:", err.message);
  });
