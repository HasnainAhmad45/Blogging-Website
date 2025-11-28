const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL connection

// ✅ Get Trending Posts (most liked)
router.get("/trending", async (req, res) => {
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
      WHERE b.status = 'published'
      ORDER BY likesCount DESC, b.createdAt DESC
    `;

    const [results] = await db.promise().query(query);
    res.json(results);
  } catch (err) {
    console.error("❌ Error fetching trending blogs:", err);
    res.status(500).json({ message: "Server error while fetching trending blogs" });
  }
});


// ✅ Get Top Authors (most published blogs)
router.get("/authors", (req, res) => {
  const query = `
    SELECT 
      u.id, 
      u.name, 
      u.profile_picture, 
      COUNT(b.id) AS total_posts
    FROM users u
    LEFT JOIN blogs b ON u.id = b.user_id AND b.status = 'published'
    GROUP BY u.id
    ORDER BY total_posts DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching top authors:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

module.exports = router;
