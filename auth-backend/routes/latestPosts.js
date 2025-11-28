const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL connection pool

// ✅ GET latest published posts (enhanced)
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId || 0; // optional: pass current user ID to check likes

    const query = `
      SELECT 
        b.id,
        b.subject AS title,
        b.text,
        b.image,
        b.category,
        b.status,
        b.createdAt,
        b.updatedAt,
        u.id AS userId,
        u.name AS authorName,
        u.profile_picture AS authorAvatar,
        (SELECT COUNT(*) FROM likes l WHERE l.blog_id = b.id) AS likesCount,
        (SELECT COUNT(*) FROM comments c WHERE c.blog_id = b.id) AS commentsCount,
        EXISTS(SELECT 1 FROM likes l WHERE l.blog_id = b.id AND l.user_id = ?) AS userLiked
      FROM blogs b
      JOIN users u ON b.user_id = u.id
      WHERE b.status = 'published'
      ORDER BY b.createdAt DESC
      LIMIT 10
    `;

    const [results] = await db.promise().query(query, [userId]);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching latest posts:", err);
    res.status(500).json({ error: "Database error", message: err.message });
  }
});

module.exports = router;
