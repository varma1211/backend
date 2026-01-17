import User from "../Models/User.js";
import sendEmail from "../sendmail.js";

export const notifyUsers = async (job) => {
  try {
    const users = await User.find({ email: { $exists: true } }).select("email");

    console.log("📧 Notifying users:", users.length);

    for (const user of users) {
      try {
        await sendEmail({
          to: user.email,
          subject: `🚀 New Job Posted: ${job.title}`,
          title: "New Job Opportunity",
          message: `
            <strong>Role:</strong> ${job.title}<br/>
            <strong>Company:</strong> ${job.company}<br/>
            <strong>Location:</strong> ${job.location}<br/>
            <strong>Salary:</strong> ${job.salary}
          `,
          actionText: "View & Apply",
          actionUrl: "http://localhost:5173/jobs",
        });

        // ⏳ Gmail throttle protection
        await new Promise((res) => setTimeout(res, 1500));

      } catch (emailErr) {
        console.warn(
          `⚠️ Email failed for ${user.email}:`,
          emailErr.responseCode || emailErr.message
        );
      }
    }

  } catch (err) {
    console.error("❌ Notification system error:", err.message);
  }
};
