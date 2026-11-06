
const bcrypt = require("bcrypt");
const pool = require("../config/db");

// ADMIN LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required."
      });
    }

    const [admins] = await pool.execute(
      "SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1",
      [username.trim()]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password."
      });
    }

    const admin = admins[0];

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password."
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Unable to create secure session."
        });
      }

      req.session.admin = {
        id: admin.id,
        username: admin.username
      };

      req.session.save((saveError) => {
        if (saveError) {
          return res.status(500).json({
            success: false,
            message: "Unable to save session."
          });
        }

        return res.json({
          success: true,
          message: "Admin login successful.",
          admin: {
            id: admin.id,
            username: admin.username
          }
        });
      });
    });

  } catch (error) {
    console.error("Admin Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to login."
    });
  }
};

// ADMIN LOGOUT
exports.logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Unable to logout."
      });
    }

    res.clearCookie("gda_admin_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.json({
      success: true,
      message: "Admin logout successful."
    });
  });
};

// CHECK LOGGED-IN ADMIN
exports.me = (req, res) => {
  return res.json({
    success: true,
    admin: req.session.admin
  });
};

// GET ALL CUSTOMER ENQUIRIES
exports.getEnquiries = async (req, res) => {
  try {
    const [enquiries] = await pool.execute(`
      SELECT
        id,
        full_name,
        email,
        phone,
        business_name,
        service_type,
        message,
        status,
        created_at
      FROM customer_enquiries
      ORDER BY created_at DESC
    `);

    return res.json({
      success: true,
      enquiries
    });

  } catch (error) {
    console.error("Get Enquiries Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load enquiries."
    });
  }
};
