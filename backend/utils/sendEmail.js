import axios from "axios";

const sendEmail = async (to, subject, text) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Your App",
          email: process.env.EMAIL_USER,
        },
        to: [{ email: to }],
        subject: subject,
        textContent: text,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("Email sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Email API error:", error.response?.data || error.message);
    throw error;
  }
};

export default sendEmail;
