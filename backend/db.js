const mysql = require("mysql2/promise");
require("dotenv").config();

const connectionLimit = Number(process.env.DB_CONNECTION_LIMIT || 2);
if (!Number.isInteger(connectionLimit) || connectionLimit < 1) {
  throw new Error("DB_CONNECTION_LIMIT must be a positive integer.");
}

const ssl = String(process.env.DB_SSL).toLowerCase() === "true"
  ? {
      rejectUnauthorized: true,
      ...(process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA } : {}),
    }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...(ssl ? { ssl } : {}),
  waitForConnections: true,
  connectionLimit,
  maxIdle: connectionLimit,
  idleTimeout: 60000,
  enableKeepAlive: true,
  queueLimit: 0,
});

module.exports = pool;