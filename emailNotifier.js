import User from "../Models/User.js";
import sendEmail from "../sendmail.js";

export const notifyUsersAboutJob = async (job) => {
  try {
    const users = await User.find().select("email");

    for (const user of users) {
      try {
        await sendEmail({
          to: user.email,
          subject: "🚀 New Job Posted on TalentBridge",
          title: job.title,
          message: `A new job has been posted at ${job.company}.`,
          actionText: "View Job",
          actionUrl: "http://localhost:5173/jobs"
        });

        // Throttle Gmail
        await new Promise(res => setTimeout(res, 1500));

      } catch (emailErr) {
        // 🔥 DO NOT THROW
        console.warn(
          `⚠️ Email warning for ${user.email}:`,
          emailErr.responseCode || emailErr.message
        );
      }
    }

  } catch (err) {
    console.error("❌ Email notification system error:", err.message);
  }
};
