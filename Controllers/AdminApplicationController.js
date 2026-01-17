import Application from "../Models/Application.js";
import sendEmail from "../sendmail.js";

/* ===============================
   GET ALL ADMIN APPLICATIONS
================================ */
export const getAdminApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "name email")
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Admin applications error:", err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

/* ===============================
   GET APPLICATION COUNT BY JOB
================================ */
export const getApplicationsCountByJob = async (req, res) => {
  try {
    const result = await Application.aggregate([
      {
        $group: {
          _id: "$job",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$job" },
      {
        $project: {
          _id: 0,
          jobId: "$job._id",
          jobTitle: "$job.title",
          applications: "$count"
        }
      }
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to get application counts" });
  }
};

/* ===============================
   GET SINGLE APPLICATION
================================ */
export const getSingleApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("user", "name email phone location")
      .populate("job", "title company location salary");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch application" });
  }
};

/* ===============================
   UPDATE APPLICATION STATUS
   (Applied / Reviewed / Shortlisted / Rejected)
================================ */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("user", "email name")
      .populate("job", "title");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    // 📧 Email notification
    await sendEmail({
      to: application.user.email,
      subject: `Application Status Updated – ${application.job.title}`,
      html: `
        <p>Hello ${application.user.name},</p>
        <p>Your application for <b>${application.job.title}</b> is now:</p>
        <h3>${status}</h3>
        <p>– TalentBridge Team</p>
      `
    });

    res.status(200).json({
      message: "Status updated successfully",
      application
    });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

/* ===============================
   REJECT APPLICATION (ALIAS)
================================ */
export const rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("user", "email name")
      .populate("job", "title");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "Rejected";
    await application.save();

    await sendEmail({
      to: application.user.email,
      subject: `Application Rejected – ${application.job.title}`,
      html: `
        <p>Hello ${application.user.name},</p>
        <p>Unfortunately, your application for <b>${application.job.title}</b> was rejected.</p>
        <p>– TalentBridge Team</p>
      `
    });

    res.status(200).json({ message: "Application rejected successfully" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Failed to reject application" });
  }
};
