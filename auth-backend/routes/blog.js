const express = require("express");
const db = require("../db");
const authenticate = require("../middleware/authenticate");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");


const router = express.Router();

router.post("/", authenticate, upload.single("image"), (req, res) => {
  const { subject, text, status, category, image } = req.body;
  const userId = req.user.id;

  // Validation
  if (!subject || subject.trim() === "")
    return res.status(400).json({ error: "Subject required" });
  if (!text || text.trim() === "")
    return res.status(400).json({ error: "Message required" });
  if (
    !category ||
    !["Tech", "Lifestyle", "Business", "Travel", "Food", "Health"].includes(
      category
    )
  )
    return res.status(400).json({ error: "Valid category required" });

  const sql =
    "INSERT INTO blogs (user_id, subject, text, image, status, category) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [userId, subject, text, image || null, status || "draft", category],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: "Blog created", blogId: result.insertId });
    }
  );
});

// PUBLISH BLOG
router.put("/publish/:id", authenticate, (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  const checkSql = "SELECT * FROM blogs WHERE id=? AND user_id=?";
  db.query(checkSql, [blogId, userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!results[0]) return res.status(404).json({ message: "Blog not found" });

    const blog = results[0];
    if (blog.status === "published") {
      return res.status(400).json({ message: "Blog is already published" });
    }

    const updateSql =
      "UPDATE blogs SET status='published', updatedAt=NOW() WHERE id=?";
    db.query(updateSql, [blogId], (err) => {
      if (err) return res.status(500).json({ message: "Failed to publish blog" });
      res.json({ message: "Blog published successfully" });
    });
  });
});


router.get("/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const query = `
      SELECT 
        b.id,
        b.subject,
        b.text,
        b.image,
        b.category,
        b.createdAt,
        u.id AS userId,
        u.name AS authorName,
        u.profile_picture AS authorAvatar,
        (SELECT COUNT(*) FROM likes l WHERE l.blog_id = b.id) AS likesCount,
        (SELECT COUNT(*) FROM comments c WHERE c.blog_id = b.id) AS commentsCount
      FROM blogs b
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ? AND b.status = 'published'
    `;

    const [results] = await db.promise().query(query, [postId]);

    if (results.length === 0)
      return res.status(404).json({ message: "Post not found" });

    res.json(results[0]);
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
