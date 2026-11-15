
const mysql = require("mysql2/promise");
const fs = require("fs");
require("dotenv").config();

const requiredEnv = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME"
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

let ca;

if (process.env.DB_CA) {
  ca = process.env.DB_CA;
} else if (process.env.DB_CA_PATH) {
  ca = fs.readFileSync(process.env.DB_CA_PATH, "utf8");
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    ...(ca ? { ca } : {}),
    rejectUnauthorized: true
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 100
});

module.exports = pool;
