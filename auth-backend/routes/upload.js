const express = require("express");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const { cloudinary } = require("../config/cloudinary");
const streamifier = require("streamifier");

// ✅ Multer Setup (temporary local upload)
const upload = multer({ dest: "uploads/" });

// ✅ Route: Upload Image to Cloudinary
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blogs",
    });

    // Delete local file
    fs.unlinkSync(req.file.path);

    // Send back the Cloudinary image URL
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
});

module.exports = router;
