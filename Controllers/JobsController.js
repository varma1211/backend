import Job from "../Models/Jobs.js";
import sendEmail from "../sendmail.js";
import User from "../Models/User.js";

export const createJob = async (req, res) => {
  try {
    // 1️⃣ Create Job
    const job = await Job.create({
      title: req.body.title,
      company: req.body.company,
      sector: req.body.sector,
      jobType: req.body.jobType,
      location: req.body.location,
      salary: req.body.salary,
      experience: req.body.experience,
      skills: req.body.skills,
      description: req.body.description,
      postedBy: req.user.id,
    });

    // 2️⃣ Fetch users
    const users = await User.find({ email: { $exists: true } }).select("email");

    console.log("📧 Users found for notification:", users.length);

    // 3️⃣ Send emails (NON-BLOCKING)
    try {
      if (users.length > 0) {
        await Promise.all(
          users.map(user =>
            sendEmail({
              to: user.email,
              subject: `🚀 New Job Posted: ${job.title}`,
              html: `
                <h2>New Job Posted on TalentBridge</h2>
                <p><strong>Role:</strong> ${job.title}</p>
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Salary:</strong> ${job.salary}</p>
              `
            })
          )
        );
      }
    } catch (emailErr) {
      console.error("⚠️ Email sending failed:", emailErr.message);
      // ❗ DO NOT throw error
    }

    // 4️⃣ ALWAYS send success response
    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    });

  } catch (error) {
    console.error("❌ Job creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to post job",
    });
  }
};


export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    next(err);
  }
};
export const getLatestJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(2);

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest jobs" });
  }
};
export const getTodayJobCount = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const count = await Job.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch count" });
  }
};

