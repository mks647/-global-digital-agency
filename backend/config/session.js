
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
require("dotenv").config();

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 8
  }
});

module.exports = sessionMiddleware;
