// utils/otp.js
const nodemailer = require("nodemailer");

async function sendOtp(email, otp) {
  try {
    // Create reusable transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME, // your Gmail
        pass: process.env.MAIL_PASSWORD, // your Gmail App Password
      },
    });

    // Email options
    const mailOptions = {
      from: `"Kick Start Blog" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP for Signup Verification",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      html: `
        <h2>Email Verification</h2>
        <p>Hello,</p>
        <p>Your OTP for signup verification is:</p>
        <h3 style="color: purple;">${otp}</h3>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent: %s", info.messageId);

  } catch (error) {
    console.error("❌ Error sending OTP:", error);
  }
}

module.exports = sendOtp;
