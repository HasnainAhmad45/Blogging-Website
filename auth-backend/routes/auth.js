const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const sendOtp = require("../utils/otp");
const { uploadToCloudinary } = require("../config/cloudinary");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");
const router = express.Router();

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  
  if (!user || !user.id) {
    throw new Error("Invalid user data for token generation");
  }

  return jwt.sign(
    { id: user.id, role: user.role || "author" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // longer expiration for auto-login
  );
};

// -------------------- SIGNUP / REQUEST OTP --------------------
router.post("/request-otp", upload.single("profilePic"), async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, mobileNumber } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Check if user exists
    const [existingUsers] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Upload profile picture if provided
    let profile_picture = null;
    let profilePicId = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      profile_picture = result.secure_url;
      profilePicId = result.public_id;
    }

    // Insert user into DB
    const fullName = `${firstName} ${lastName}`;
    await db.promise().query(
      `INSERT INTO users 
      (firstName,lastName,name,email,password,dateOfBirth,mobileNumber,otp,otpExpiry,profile_picture,profilePicId,role) 
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [firstName, lastName, fullName, email, hashedPassword, dateOfBirth, mobileNumber, otp, otpExpiry, profile_picture, profilePicId, "author"]
    );

    // Send OTP via email
    await sendOtp(email, otp);

    res.json({ success: true, message: "OTP sent successfully!" });

  } catch (err) {
    console.error("❌ Error in /request-otp:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- VERIFY OTP --------------------
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP required" });
    }

    const [rows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });

    const user = rows[0];

    if (user.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (new Date(user.otpExpiry) < new Date()) return res.status(400).json({ success: false, message: "OTP expired" });

    // Clear OTP
    await db.promise().query("UPDATE users SET otp = NULL, otpExpiry = NULL WHERE email = ?", [email]);

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        dateOfBirth: user.dateOfBirth,
        profilePicture: user.profile_picture,
        role: user.role || "author",
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("❌ Error in /verify-otp:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- LOGIN --------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

    const [rows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const user = rows[0];

    if (user.otp) return res.status(400).json({ success: false, message: "Please verify OTP first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        dateOfBirth: user.dateOfBirth,
        profilePicture: user.profile_picture,
        role: user.role || "author",
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("❌ Error in /login:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------------------- GET CURRENT USER --------------------
router.get("/me", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [userId]);
    
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = rows[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        dateOfBirth: user.dateOfBirth,
        profilePicture: user.profile_picture,
        role: user.role || "author",
        createdAt: user.createdAt
      },
    });
  } catch (err) {
    console.error("❌ Error in /me:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
