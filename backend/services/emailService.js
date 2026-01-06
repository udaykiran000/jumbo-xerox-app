const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  // Configure this with real Gmail/SMTP later
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "Jumbo Xerox <no-reply@jumbo.com>",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email Sent to: " + to);
  } catch (error) {
    console.error("Email Error:", error);
  }
};

module.exports = sendEmail;
