import mongoose from "mongoose";
import Application from "../Models/Application.js";
import Job from "../Models/Jobs.js";
import User from "../Models/User.js";
import sendEmail from "../sendmail.js";

/* ===============================
   APPLY JOB / GOVT DETAILS MAIL
================================ */
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID required" });
    }

    // 1️⃣ Fetch job FIRST
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🟢 GOVERNMENT JOB FLOW
    if (job.sector === "Government") {
      const user = await User.findById(userId).select("name email");

      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: "📌 Official Government Job Websites",
          html: `
            <h2>${job.title}</h2>
            <p>Hello <b>${user.name}</b>,</p>

            <p>This is a <b>Government Job</b>.</p>

            <p>Please check updates only on official websites:</p>

            <ul>
              <li>UPSC – https://upsc.gov.in</li>
              <li>SSC – https://ssc.nic.in</li>
              <li>Banking – https://ibps.in</li>
              <li>Railways – https://indianrailways.gov.in</li>
              <li>State Govt – https://employment.gov.in</li>
              <li>Defence – https://joinindianarmy.nic.in</li>
            </ul>

            <p><b>Note:</b> TalentBridge does not accept applications for government jobs.</p>
            <br/>
            <p>– TalentBridge Team</p>
          `,
        });
      }

      return res.json({
        message: "Official government websites sent to your email",
      });
    }

    // 🔵 IT / NON-IT JOB FLOW
    const alreadyApplied = await Application.findOne({
      user: userId,
      job: jobId,
    });

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You already applied for this job" });
    }

    const application = await Application.create({
      user: userId,
      job: jobId,
    });

    const user = await User.findById(userId).select("name email");

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "✅ Job Application Submitted Successfully",
        html: `
          <h2>Application Submitted</h2>
          <p>Hello <b>${user.name}</b>,</p>
          <p>You have successfully applied for:</p>
          <ul>
            <li><b>Role:</b> ${job.title}</li>
            <li><b>Company:</b> ${job.company}</li>
            <li><b>Location:</b> ${job.location}</li>
          </ul>
          <p>We’ll notify you once the status changes.</p>
          <br/>
          <p>– TalentBridge Team</p>
        `,
      });
    }

    res.status(201).json({
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    console.error("❌ Apply job failed:", error);
    res.status(500).json({ message: "Apply job failed" });
  }
};

/* ===============================
   DASHBOARD COUNT
================================ */
export const getAppliedJobsCount = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const count = await Application.countDocuments({
    user: userId,
  });

  res.json({ appliedJobs: count });
};

/* ===============================
   MY APPLICATIONS
================================ */
export const getMyApplications = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const applications = await Application.find({
    user: userId,
  })
    .populate("job", "title company location")
    .sort({ createdAt: -1 });

  res.json(applications);
};

/* ===============================
   APPLIED JOB IDS
================================ */
export const getUserAppliedJobs = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);

  const applications = await Application.find({
    user: userId,
  }).select("job");

  const appliedJobIds = applications.map((app) =>
    app.job.toString()
  );

  res.json({ appliedJobIds });
};
