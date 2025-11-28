const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const blogRoutes = require("./routes/blog");
const postRoutes = require("./routes/post");
const uploadRoute = require("./routes/upload");
const profileRoutes = require("./routes/profile");
const latestPostsRoutes = require("./routes/latestPosts");
const sidebarRoutes = require("./routes/sidebar");
const detailsRoutes = require("./routes/authordetails");


const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// CORS configuration - allow multiple origins
app.use(cors({ 
  origin: [
    "http://localhost:5173", 
    "http://localhost:3000", 
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174"
  ],
  credentials: true 
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/profile", profileRoutes);
app.use("/api/latest", latestPostsRoutes);
app.use("/api/sidebar", sidebarRoutes);
app.use("/api/authordetails", detailsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ 
    error: "Internal server error", 
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong" 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/latest`);
});
