
const pool = require("./config/db");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const sessionMiddleware = require("./config/session");
const enquiryRoutes = require("./routes/enquiryRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Render proxy in production
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Allowed Frontend Origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://127.0.0.1:5500",
  "http://localhost:5500"
].filter(Boolean);

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type"]
}));

// JSON Body Parser
app.use(express.json({ limit: "10kb" }));

// Session Middleware
app.use(sessionMiddleware);

// General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.use("/api", apiLimiter);

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Global Digital Agency API is running!"
  });
});

// Backend and Database Health Check
app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS db");

    res.json({
      success: true,
      message: "Backend and Aiven database are connected",
      database: rows[0].db
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      code: error.code || "UNKNOWN_ERROR"
    });
  }
});

// Customer Enquiry API
app.use("/api/enquiries", enquiryRoutes);

// Admin Authentication API
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
