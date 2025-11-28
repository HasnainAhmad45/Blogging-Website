const express = require("express");
const router = express.Router();
const db = require("../db"); // adjust path if needed
const jwt = require("jsonwebtoken"); // if you use JWT for auth

// GET author details + their approved blogs
router.get("/:id", async (req, res) => {
  const authorId = req.params.id;
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  let loggedInUserId = null;

  // Decode token if exists
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      loggedInUserId = decoded.id;
    } catch (err) {
      console.log("Invalid token, ignoring userLiked check");
    }
  }

  try {
    // Fetch author info (all fields)
    const [authorRows] = await db.promise().query(
      `
      SELECT 
        id,
        firstName,
        lastName,
        dateOfBirth,
        mobileNumber,
        name,
        email,
        role,
        profile_picture,
        profilePicId,
        createdAt
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [authorId]
    );

    if (!authorRows || authorRows.length === 0) {
      return res.status(404).json({ message: "Author not found" });
    }

    const author = authorRows[0];

    // Fetch blogs with author info and likes count
    const [blogs] = await db.promise().query(
      `
      SELECT 
        b.id,
        b.user_id AS userId,
        b.subject,
        b.text,
        b.category,
        b.image,
        b.status,
        b.createdAt,
        u.name AS authorName,
        u.profile_picture AS authorAvatar,
        (SELECT COUNT(*) FROM likes WHERE blog_id = b.id) AS likesCount,
        ${
          loggedInUserId
            ? `(SELECT COUNT(*) > 0 FROM likes WHERE blog_id = b.id AND user_id = ?) AS userLiked`
            : "0 AS userLiked"
        }
      FROM blogs b
      JOIN users u ON u.id = b.user_id
      WHERE b.user_id = ? AND b.status = 'published'
      ORDER BY b.createdAt DESC
      `,
      loggedInUserId ? [loggedInUserId, authorId] : [authorId]
    );

    res.json({ author, blogs });
  } catch (error) {
    console.error("❌ Author fetch error:", error);
    res.status(500).json({ message: "Server error fetching author" });
  }
});

module.exports = router;
