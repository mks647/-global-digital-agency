
const express = require("express");
const router = express.Router();

// Import controller functions
const {
  login,
  logout,
  me,
  getEnquiries
} = require("../controllers/adminController");

// Import admin authentication middleware
const { requireAdmin } = require("../middleware/adminAuth");

// Login rate limiter
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  }
});

// Admin Login
router.post("/login", loginLimiter, login);

// Admin Logout
router.post("/logout", requireAdmin, logout);

// Check Admin Session
router.get("/me", requireAdmin, me);

// Get Customer Enquiries
router.get("/enquiries", requireAdmin, getEnquiries);

module.exports = router;
