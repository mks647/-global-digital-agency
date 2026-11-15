
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const fs = require("fs");
require("dotenv").config();

if (!process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET.length < 32) {
  throw new Error("SESSION_SECRET must be at least 32 characters");
}

let ca;

if (process.env.DB_CA) {
  ca = process.env.DB_CA;
} else if (process.env.DB_CA_PATH) {
  ca = fs.readFileSync(process.env.DB_CA_PATH, "utf8");
}

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    ...(ca ? { ca } : {}),
    rejectUnauthorized: true
  },

  createDatabaseTable: true,

  schema: {
    tableName: "admin_sessions"
  },

  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000
});

const sessionMiddleware = session({
  name: "gda_admin_session",
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
    maxAge: 1000 * 60 * 60 * 8
  }
});

module.exports = sessionMiddleware;
