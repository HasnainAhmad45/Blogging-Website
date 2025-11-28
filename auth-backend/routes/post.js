const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ MySQL connection
const auth = require("../middleware/authenticate"); // ✅ JWT middleware

// ✅ Get all published posts by category (public)
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const userId = req.user?.id || null;

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
        u.id AS userId,
        u.name AS authorName,
        u.profile_picture AS authorAvatar,   -- <-- add this
        (SELECT COUNT(*) FROM likes l WHERE l.blog_id = b.id) AS likesCount,
        (SELECT COUNT(*) FROM comments c WHERE c.blog_id = b.id) AS commentsCount,
        EXISTS(SELECT 1 FROM likes l WHERE l.blog_id = b.id AND l.user_id = ?) AS userLiked
      FROM blogs b
      JOIN users u ON b.user_id = u.id
      WHERE b.category = ? AND b.status = 'published'
      ORDER BY b.createdAt DESC
      `,
      [userId, category]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching category posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


// ✅ Like / Unlike post (protected)
router.post("/:id/like", auth, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    // Check if user already liked
    const [rows] = await db.promise().query(
      "SELECT id FROM likes WHERE blog_id = ? AND user_id = ?",
      [postId, userId]
    );

    if (rows.length > 0) {
      // Unlike
      await db.promise().query(
        "DELETE FROM likes WHERE blog_id = ? AND user_id = ?",
        [postId, userId]
      );
    } else {
      // Like
      await db.promise().query(
        "INSERT INTO likes (blog_id, user_id) VALUES (?, ?)",
        [postId, userId]
      );
    }

    // Get updated like count and user like status
    const [[{ count }]] = await db.promise().query(
      "SELECT COUNT(*) AS count FROM likes WHERE blog_id = ?",
      [postId]
    );

    const [[{ userLiked }]] = await db.promise().query(
      "SELECT EXISTS(SELECT 1 FROM likes WHERE blog_id = ? AND user_id = ?) AS userLiked",
      [postId, userId]
    );

    res.json({ liked: !!userLiked, likesCount: count });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ message: "Error liking post" });
  }
});

// ✅ Get all comments for a post (public)
router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.promise().query(
      `
      SELECT 
        c.id, 
        c.comment AS content,
        c.createdAt, 
        c.updatedAt,
        u.id AS userId, 
        u.name AS userName,
        u.profile_picture AS userAvatar   -- <-- add this
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.blog_id = ?
      ORDER BY c.createdAt DESC
      `,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});


// ✅ Add a new comment (protected)
router.post("/:id/comment", auth, async (req, res) => {
  const { id } = req.params; // blog_id
  const userId = req.user.id;
  const { content } = req.body;

  if (!content) return res.status(400).json({ error: "Content required" });

  try {
    const [result] = await db.promise().query(
      "INSERT INTO comments (blog_id, user_id, comment) VALUES (?, ?, ?)",
      [id, userId, content]
    );

    res.json({ message: "Comment added", commentId: result.insertId });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// ✅ Get post like status (protected)
router.get("/:id/status", auth, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const [likesData] = await db.promise().query(
      "SELECT COUNT(*) AS likesCount FROM likes WHERE blog_id = ?",
      [postId]
    );

    const [userLikedData] = await db.promise().query(
      "SELECT 1 AS liked FROM likes WHERE blog_id = ? AND user_id = ?",
      [postId, userId]
    );

    const userLiked = userLikedData.length > 0;

    res.json({ likesCount: likesData[0].likesCount, userLiked });
  } catch (err) {
    console.error("Status route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
