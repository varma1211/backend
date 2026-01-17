import Job from "../Models/Jobs.js";
import Application from "../Models/Application.js";

/* ================================
   GET ADMIN JOBS WITH COUNTS
================================ */
export const getAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "job",
          as: "applications",
        },
      },
      {
        $addFields: {
          applicationsCount: { $size: "$applications" },
        },
      },
      {
        $project: {
          applications: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Admin jobs fetch error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

/* ================================
   DELETE JOB (OPTIONAL)
================================ */
export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    await Job.findByIdAndDelete(jobId);
    await Application.deleteMany({ job: jobId });

    res.status(200).json({ message: "Job deleted successfully" });

  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
};
