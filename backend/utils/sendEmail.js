import nodemailer from "nodemailer";
import dns from "dns";

// Force Node.js to prefer IPv4 over IPv6.
// This fixes timeout issues when deployed to Vercel/Render where IPv6 might hang.
dns.setDefaultResultOrder("ipv4first");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 10000, // 10 seconds
    socketTimeout: 10000, // 10 seconds
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password
    },
  });

  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready to take our messages");
        resolve(success);
      }
    });
  });

  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    }, (err, info) => {
      if (err) {
        console.error("sendMail error", err);
        reject(err);
      } else {
        console.log("sendMail success", info);
        resolve(info);
      }
    });
  });
};

export default sendEmail;
