const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: email,
      to: process.env.MAIL_USERNAME,
      subject: `Blogging Website Queries`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("❌ Email Error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
