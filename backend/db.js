const mysql = require("mysql2/promise");
require("dotenv").config();

const requiredVariables = [
  "DB_HOST",
  "DB_PORT",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_SSL",
];
const missingVariables = requiredVariables.filter(
  (name) => !process.env[name]?.trim(),
);

if (missingVariables.length) {
  throw new Error(
    `Missing required database environment variables: ${missingVariables.join(", ")}`,
  );
}

const host = process.env.DB_HOST.trim();
if (
  /^(?:https?:\/\/|.*\/|.*\s|<.*>)$/i.test(host) ||
  host.toLowerCase().endsWith(".railway.internal") ||
  /^(?:localhost|127(?:\.\d{1,3}){3}|::1)$/i.test(host)
) {
  throw new Error(
    "DB_HOST must be Railway's public TCP Proxy hostname, not a URL, placeholder, or internal hostname.",
  );
}

const port = Number(process.env.DB_PORT);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("DB_PORT must be the valid external TCP Proxy port from Railway.");
}

const sslSetting = process.env.DB_SSL.trim().toLowerCase();
if (!["true", "false"].includes(sslSetting)) {
  throw new Error(
    "DB_SSL must be set to true or false according to Railway's connection settings.",
  );
}

const connectionLimit = Number(process.env.DB_CONNECTION_LIMIT || 2);
if (!Number.isInteger(connectionLimit) || connectionLimit < 1) {
  throw new Error("DB_CONNECTION_LIMIT must be a positive integer.");
}

const ssl =
  sslSetting === "true"
    ? {
        rejectUnauthorized: true,
        ...(process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA } : {}),
      }
    : undefined;

const pool = mysql.createPool({
  host,
  port,
  user: process.env.DB_USER.trim(),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME.trim(),
  ...(ssl ? { ssl } : {}),
  waitForConnections: true,
  connectionLimit,
  maxIdle: connectionLimit,
  idleTimeout: 60000,
  enableKeepAlive: true,
  queueLimit: 0,
});

module.exports = pool;