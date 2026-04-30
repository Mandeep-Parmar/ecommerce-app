import nodemailer from "nodemailer";
import dns from "dns";

// Force Node.js to prefer IPv4 over IPv6.
// This fixes timeout issues when deployed to Vercel/Render where IPv6 might hang.
dns.setDefaultResultOrder("ipv4first");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    family: 4, // force IPv4 (important)
    auth: {
      user: process.env.EMAIL_USER, // Your Brevo Login
      pass: process.env.EMAIL_PASS, // Your Brevo SMTP Key
    },
  });

  try {
    // Verify connection
    await transporter.verify();
    console.log("SMTP server is ready");

    // Send mail
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};

export default sendEmail;
