
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const { createEnquiry } = require("../controllers/enquiryController");

const enquiryValidation = [
  body("full_name")
    .isString().withMessage("Name must be text.")
    .trim()
    .notEmpty().withMessage("Name is required.")
    .isLength({ max: 100 }),

  body("email")
    .isString()
    .trim()
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 254 }),

  body("phone")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ max: 20 }),

  body("business_name")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .trim()
    .isLength({ max: 150 }),

  body("service_type")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 100 }),

  body("message")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 3000 }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry data.",
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }

    next();
  }
];

router.post("/", enquiryValidation, createEnquiry);

module.exports = router;
