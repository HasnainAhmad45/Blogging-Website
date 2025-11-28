const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  // Check if JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not configured in environment variables");
    return res.status(500).json({ message: "Server configuration error" });
  }

  // Get token from Authorization header
  const authHeader = req.headers.authorization || req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  // Expect format: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ success: false, message: "Invalid token format. Use: Bearer <token>" });
  }

  const token = parts[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validate decoded token has required fields
    if (!decoded.id) {
      return res.status(401).json({ success: false, message: "Invalid token payload" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    } else {
      console.error("JWT verification failed:", err.message);
      return res.status(401).json({ success: false, message: "Token verification failed" });
    }
  }
};
