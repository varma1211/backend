import dotenv from "dotenv";
dotenv.config();

import sendEmail from "./sendmail.js";

await sendEmail({
  to: "gopalaanilvarmaupputuri@gmail.com",
  subject: "Brevo Test",
  html: "<h1>Test Success</h1>"
});

process.exit();
