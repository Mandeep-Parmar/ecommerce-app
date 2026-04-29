import nodemailer from "nodemailer";
import dns from "dns";

// Force Node.js to prefer IPv4 over IPv6.
// This fixes timeout issues when deployed to Vercel/Render where IPv6 might hang.
dns.setDefaultResultOrder("ipv4first");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

export default sendEmail;
