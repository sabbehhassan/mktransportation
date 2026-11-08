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
const allowedOrigins = (
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:5173")
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/+$/, ""))) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS."));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
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
  try {
    await db.query("SELECT 1");

    res.json({
      success: true,
      message: "MySQL connected successfully",
    });
  } catch (error) {
    console.error("MySQL connection error:", error.message);

    res.status(500).json({
      success: false,
      message: "MySQL connection failed",
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