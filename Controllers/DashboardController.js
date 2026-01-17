import Application from "../Models/Application.js";
import Job from "../Models/Jobs.js";

export const getDashboardStats = async (req, res) => {
  try {
    const appliedJobs = await Application.countDocuments({
      user: req.user.id,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newJobsToday = await Job.countDocuments({
      createdAt: { $gte: today },
    });

    res.json({
      appliedJobs,
      newJobsToday,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
};
