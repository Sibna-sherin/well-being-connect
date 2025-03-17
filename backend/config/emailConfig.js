import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // You can change this to another email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email (store in .env)
    pass: process.env.EMAIL_PASS, // Email password or app password
  },
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email sending failed");
  }
};
