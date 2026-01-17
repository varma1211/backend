import Job from "../Models/Jobs.js";
import User from "../Models/User.js";

import Application from "../Models/Application.js";
import ExcelJS from "exceljs";

/* ================================
   DOWNLOAD ALL JOBS WITH COUNTS
================================ */
export const downloadJobsExcel = async (req, res) => {
  try {
    // Aggregate applications count per job
    const jobs = await Job.aggregate([
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "job",
          as: "applications"
        }
      },
      {
        $addFields: {
          applicationsCount: { $size: "$applications" }
        }
      },
      {
        $project: {
          applications: 0
        }
      }
    ]);

    // Create Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Jobs");

    sheet.columns = [
      { header: "Job Title", key: "title", width: 25 },
      { header: "Company", key: "company", width: 20 },
      { header: "Sector", key: "sector", width: 15 },
      { header: "Job Type", key: "jobType", width: 15 },
      { header: "Location", key: "location", width: 20 },
      { header: "Salary", key: "salary", width: 15 },
      { header: "Applications", key: "applicationsCount", width: 15 },
      { header: "Posted At", key: "createdAt", width: 20 }
    ];

    jobs.forEach(job => sheet.addRow(job));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=jobs.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to download jobs" });
  }
};
/* ================================
   DOWNLOAD ALL APPLICATIONS
================================ */
export const downloadApplicationsExcel = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "name email")
      .populate("job", "title company");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Applications");

    sheet.columns = [
      { header: "Student Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Job Title", key: "jobTitle", width: 25 },
      { header: "Company", key: "company", width: 20 },
      { header: "Applied Date", key: "date", width: 20 }
    ];

    applications.forEach(app => {
      sheet.addRow({
        name: app.user?.name,
        email: app.user?.email,
        jobTitle: app.job?.title,
        company: app.job?.company,
        date: app.createdAt
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applications.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to download applications" });
  }
};
export const downloadStudentDatabase = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select(
      "name email phone location profileCompletion resume createdAt"
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Students");

    sheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Location", key: "location", width: 20 },
      { header: "Profile Completion (%)", key: "profileCompletion", width: 25 },
      { header: "Resume", key: "resume", width: 30 },
      { header: "Joined On", key: "createdAt", width: 20 }
    ];

    users.forEach(user => {
      sheet.addRow({
        name: user.name,
        email: user.email,
        phone: user.phone || "-",
        location: user.location || "-",
        profileCompletion: user.profileCompletion || 0,
        resume: user.resume || "Not Uploaded",
        createdAt: user.createdAt.toISOString().split("T")[0]
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=student-database.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error("Student download error:", err);
    res.status(500).json({ message: "Failed to download student database" });
  }
};