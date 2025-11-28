const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authenticate");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const streamifier = require("streamifier");

// ✅ Multer setup (store in memory)
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Upload helper
function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}


router.put(
  "/updateProfilePic/:id",
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      // Get old profilePicId
      const [rows] = await db
        .promise()
        .query("SELECT profilePicId FROM users WHERE id = ?", [userId]);
      const oldPublicId = rows.length ? rows[0].profilePicId : null;

      // Upload new pic
      const result = await uploadToCloudinary(req.file.buffer, "user_profiles");
      const newImageUrl = result.secure_url;
      const newPublicId = result.public_id;

      // Delete old pic from Cloudinary
      if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);

      // Update DB
      await db
        .promise()
        .query(
          "UPDATE users SET profile_picture = ?, profilePicId = ? WHERE id = ?",
          [newImageUrl, newPublicId, userId]
        );

      res.json({
        message: "Profile picture updated successfully",
        imageUrl: newImageUrl,
      });
    } catch (err) {
      console.error("❌ Error updating profile picture:", err);
      const errorMessage = err.message || "Failed to upload picture";
      res.status(500).json({ message: errorMessage });
    }
  }
);

// ✅ Remove profile picture API
router.delete("/removeProfilePic/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // Get old profilePicId
    const [rows] = await db
      .promise()
      .query("SELECT profilePicId FROM users WHERE id = ?", [userId]);

    if (!rows.length || !rows[0].profilePicId) {
      return res.status(400).json({ message: "No profile picture to remove" });
    }

    const publicId = rows[0].profilePicId;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Update DB to remove profile picture info
    await db
      .promise()
      .query(
        "UPDATE users SET profile_picture = NULL, profilePicId = NULL WHERE id = ?",
        [userId]
      );

    res.json({ message: "Profile picture removed successfully" });
  } catch (err) {
    console.error("❌ Error removing profile picture:", err);
    res.status(500).json({ message: "Failed to remove profile picture" });
  }
});


// ✅ Get all blogs of the logged-in user (Cloudinary URLs stored in DB)
router.get("/myblogs", auth, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized - invalid user" });
  }
  try {
    const [rows] = await db.promise().query(
      `
      SELECT 
        b.id, 
        b.subject, 
        b.text, 
        b.image,  
        b.category, 
        b.status, 
        b.createdAt, 
        b.updatedAt,
        u.name AS authorName,
        u.profile_picture AS authorAvatar,
        (SELECT COUNT(*) FROM likes l WHERE l.blog_id = b.id) AS likesCount,
        (SELECT COUNT(*) FROM comments c WHERE c.blog_id = b.id) AS commentsCount
      FROM blogs b
      JOIN users u ON b.user_id = u.id
      WHERE b.user_id = ?
      ORDER BY b.createdAt DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching user blogs:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

module.exports = router;
