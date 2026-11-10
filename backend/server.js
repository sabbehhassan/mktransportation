require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const agreementRoutes = require("./routes/agreementRoutes");
const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/adminRoutes");
const adminInvoiceRoutes = require("./routes/adminInvoiceRoutes");
const adminRefundableReceiptRoutes = require("./routes/adminRefundableReceiptRoutes");
const adminAuth = require("./middleware/adminAuth");
const trackingRoutes = require("./routes/trackingRoutes");

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, "");
const configuredOrigins = [
  process.env.FRONTEND_URLS,
  process.env.FRONTEND_URL,
]
  .filter(Boolean)
  .flatMap((origins) => origins.split(","))
  .map(normalizeOrigin)
  .filter(Boolean);
const allowedOrigins = new Set([
  "https://www.mktransportationgroup.com",
  "https://mktransportationgroup.com",
  "https://mktransportation.vercel.app",
  ...configuredOrigins,
  ...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:5173"]),
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json({ limit: "4mb" }));

// ===============================
// HOME ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("MK Transportation Backend Running");
});

// ===============================
// API TEST
// ===============================
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "MK Transportation API Working",
  });
});

// ===============================
// MYSQL CONNECTION TEST
// ===============================
app.get("/api/db-test", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.sendStatus(404);
  }

  try {
    const requiredTables = [
      "agreements",
      "loads",
      "invoices",
      "deposit_payment_verifications",
      "refundable_receipts",
      "refundable_receipt_settings",
      "refundable_receipt_events",
    ];
    const [[databaseRow]] = await db.query("SELECT DATABASE() AS databaseName");
    await db.query("SELECT 1");
    const [tableRows] = await db.query(
      `SELECT table_name AS tableName
       FROM information_schema.tables
       WHERE table_schema = DATABASE()
         AND table_name IN (${requiredTables.map(() => "?").join(", ")})`,
      requiredTables,
    );
    const existingTables = new Set(tableRows.map((row) => row.tableName));
    const missingTables = requiredTables.filter(
      (tableName) => !existingTables.has(tableName),
    );

    return res.status(missingTables.length ? 503 : 200).json({
      success: missingTables.length === 0,
      database: databaseRow.databaseName,
      missingTables,
      requiredTables,
      message: missingTables.length
        ? "MySQL is reachable, but required application tables are missing."
        : "MySQL connection and required tables verified.",
    });
  } catch (error) {
    console.error(
      "Development database health check failed:",
      error.code || error.name,
    );

    return res.status(503).json({
      success: false,
      message: "MySQL connection or database health check failed.",
    });
  }
});

// ===============================
// AGREEMENT API
// ===============================
app.use("/api/agreement", agreementRoutes);

// ===============================
// CONTACT FORM API
// ===============================
app.use("/api/contact", contactRoutes);

// ===============================
// Admin FORM API
// ===============================

app.use("/api/admin/invoices", adminAuth, adminInvoiceRoutes);
app.use("/api/admin/invoices", adminAuth, adminRefundableReceiptRoutes);
app.use("/api/admin", adminRoutes);

// ===============================
// Tracking FORM API
// ===============================

app.use("/api/tracking", trackingRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error("Unhandled API error:", error.code || error.name);
  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

// ===============================
// LOCAL DEVELOPMENT
// ===============================
if (require.main === module) {
  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });
}

// ===============================
// VERCEL SERVERLESS SUPPORT
// ===============================
module.exports = app;