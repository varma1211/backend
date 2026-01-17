import Job from "../Models/Jobs.js";
import Application from "../Models/Application.js";

export const getAdminDashboard = async (req, res, next) => {
  try {
    // 1️⃣ Total Jobs
    const activeJobs = await Job.countDocuments();

    // 2️⃣ Total Applications
    const totalApplications = await Application.countDocuments();

    // 3️⃣ Today Applications
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayApplications = await Application.countDocuments({
      createdAt: { $gte: startOfDay }
    });

    // 4️⃣ Recent Applications (last 5)
    const recentApplicationsRaw = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("job", "title");

    const recentApplications = recentApplicationsRaw.map(app => ({
      name: app.user?.name || "Unknown",
      role: app.job?.title || "Unknown",
      time: app.createdAt
    }));

    res.status(200).json({
      activeJobs,
      totalApplications,
      todayApplications,
      recentApplications
    });

  } catch (err) {
    next(err);
  }
};
