// db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

// Use connection pool for better reliability
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
    console.error("Please check your .env file and database configuration");
    return;
  }
  console.log("✅ MySQL connected successfully");
  connection.release();
});

// Export both pool and promise-based pool for compatibility
const db = pool;
module.exports = db;
