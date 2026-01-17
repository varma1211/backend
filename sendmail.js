import dotenv from "dotenv";
dotenv.config(); // 🔥 REQUIRED

import SibApiV3Sdk from "sib-api-v3-sdk";

const client = SibApiV3Sdk.ApiClient.instance;

client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is missing");
  }

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  await apiInstance.sendTransacEmail({
    sender: {
      email: "gopalaanilvarmaupputuri@gmail.com", // verified sender
      name: "TalentBridge"
    },
    to: [{ email: to }],
    subject,
    htmlContent: html
  });
};

export default sendEmail;
