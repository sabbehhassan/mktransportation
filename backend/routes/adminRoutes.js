
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !passwordHash || !jwtSecret) {
      console.error("Admin authentication environment variables are missing.");

      return res.status(500).json({
        success: false,
        message: "Admin authentication is not configured.",
      });
    }

    const emailMatches =
      email.trim().toLowerCase() === adminEmail.trim().toLowerCase();

    const passwordMatches = await bcrypt.compare(
      password,
      passwordHash
    );

    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: adminEmail.trim().toLowerCase(),
      },
      jwtSecret,
      {
        expiresIn: "2h",
        issuer: "mk-transportation",
        audience: "mk-transportation-admin",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        email: adminEmail.trim().toLowerCase(),
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred during login.",
    });
  }
});
router.get("/agreements", require("../middleware/adminAuth"), async (req, res) => {
  try {
    const db = require("../db");

    const [rows] = await db.query(`
      SELECT
        a.id,
        a.tracking_id,
        a.agreement_type,
        a.selected_dispatch,
        a.agreement_date,
        a.carrier_name,
        a.company_name,
        a.mc_dot,
        a.phone,
        a.carrier_type,
        a.email,
        a.selected_services,
        a.payment_method,
        a.payment_terms_method,
        a.print_name,
        a.submission_status,
        a.deposit_status,
        a.created_at,
        a.updated_at,
        i.id AS invoice_id,
        i.invoice_number,
        i.status AS invoice_status,
        i.sent_at AS invoice_sent_at
      FROM agreements a
      LEFT JOIN invoices i ON i.id = (
        SELECT MAX(i2.id) FROM invoices i2 WHERE i2.agreement_id = a.id
      )
      ORDER BY a.created_at DESC
    `);

    return res.status(200).json({
      success: true,
      count: rows.length,
      agreements: rows
    });
  } catch (error) {
    console.error("Admin agreements fetch error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch carrier agreements."
    });
  }
});

// PATCH /api/admin/agreements/:id/deposit-status
// Admin can verify a deposit or mark it as pending again.

router.patch(
  "/agreements/:id/deposit-status",
  require("../middleware/adminAuth"),
  async (req, res) => {
    try {
      const db = require("../db");
      const { id } = req.params;
      const { deposit_status } = req.body || {};

      // Validate agreement ID
      if (!/^\d+$/.test(id) || Number(id) < 1) {
        return res.status(400).json({
          success: false,
          message: "Invalid agreement ID.",
        });
      }

      // Only allow these two status values
      const allowedStatuses = ["pending", "verified"];

      if (
        typeof deposit_status !== "string" ||
        !allowedStatuses.includes(deposit_status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Deposit status must be pending or verified.",
        });
      }

      // Check whether the agreement exists
      const [existing] = await db.query(
        "SELECT id, deposit_status FROM agreements WHERE id = ?",
        [Number(id)]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Carrier agreement not found.",
        });
      }

      // Update the deposit status
      await db.query(
        `UPDATE agreements
         SET deposit_status = ?, updated_at = NOW()
         WHERE id = ?`,
        [deposit_status, Number(id)]
      );

      return res.status(200).json({
        success: true,
        message:
          deposit_status === "verified"
            ? "Deposit marked as verified."
            : "Deposit marked as pending.",
        agreement: {
          id: Number(id),
          deposit_status,
        },
      });
    } catch (error) {
      console.error("Deposit status update error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to update deposit status.",
      });
    }
  }
);

// GET /api/admin/loads
// Fetch all loads for the admin dashboard.

router.get(
  "/loads",
  require("../middleware/adminAuth"),
  async (req, res) => {
    try {
      const db = require("../db");

      const [rows] = await db.query(`
        SELECT
          l.*,
          a.tracking_id AS carrier_tracking_id,
          a.carrier_name,
          a.company_name,
          a.email AS carrier_email,
          a.deposit_status
        FROM loads l
        INNER JOIN agreements a ON a.id = l.agreement_id
        ORDER BY l.assigned_at DESC, l.id DESC
      `);

      return res.status(200).json({
        success: true,
        count: rows.length,
        loads: rows,
      });
    } catch (error) {
      console.error("Admin loads fetch error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Unable to fetch loads.",
      });
    }
  }
);


// POST /api/admin/loads
// Assign a new load to a carrier whose deposit is verified.

router.post(
  "/loads",
  require("../middleware/adminAuth"),
  async (req, res) => {
    try {
      const db = require("../db");
      const crypto = require("crypto");

      const {
        agreement_id,
        load_title,
        lane_type,
        contract_duration,
        pickup_location,
        delivery_location,
        return_pickup_location,
        return_delivery_location,
        round_trips_per_week,
        pickup_time,
        transit_details,
        one_way_miles,
        round_trip_miles,
        dead_miles,
        freight_details,
        load_weight_lbs,
        backhaul_weight_lbs,
        payment_per_round_trip,
        five_day_gross,
        full_week_option,
        reservation_fee,
        reservation_fee_refundable,
        broker_name,
        broker_usdot,
        broker_mc,
        pickup_date,
        delivery_date,
        load_details,
      } = req.body || {};

      // Validate required fields.
      if (
        !Number.isSafeInteger(Number(agreement_id)) ||
        Number(agreement_id) < 1 ||
        !load_title?.trim() ||
        !pickup_location?.trim() ||
        !delivery_location?.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid agreement ID, load title, pickup location and delivery location are required.",
        });
      }

      // Verify that the agreement exists and the deposit is verified.
      const [agreements] = await db.query(
        `SELECT id, tracking_id, email, deposit_status
         FROM agreements
         WHERE id = ?
         LIMIT 1`,
        [Number(agreement_id)]
      );

      if (agreements.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Carrier agreement not found.",
        });
      }

      const agreement = agreements[0];

      if (
        String(agreement.deposit_status).toLowerCase() !== "verified"
      ) {
        return res.status(403).json({
          success: false,
          message: "The carrier deposit must be verified before assigning a load.",
        });
      }

      // Different agreements can have the same carrier email.

      const [activeLoads] = await db.query(
        `SELECT id
         FROM loads
         WHERE agreement_id = ?
           AND load_status IN ('assigned', 'picked_up', 'in_transit')
         LIMIT 1`,
        [Number(agreement_id)]
      );

      if (activeLoads.length > 0) {
        return res.status(409).json({
          success: false,
          message:
            "This agreement already has an active load. Complete or cancel it before assigning another.",
        });
      }

      // Generate a unique tracking ID.
      const loadTrackingId =
        "LOAD-" +
        new Date().toISOString().slice(0, 10).replace(/-/g, "") +
        "-" +
        crypto.randomBytes(4).toString("hex").toUpperCase();

      // Insert load information into the existing loads table.
      const [result] = await db.query(
        `INSERT INTO loads (
          load_tracking_id,
          agreement_id,
          load_title,
          lane_type,
          contract_duration,
          pickup_location,
          delivery_location,
          return_pickup_location,
          return_delivery_location,
          round_trips_per_week,
          pickup_time,
          transit_details,
          one_way_miles,
          round_trip_miles,
          dead_miles,
          freight_details,
          load_weight_lbs,
          backhaul_weight_lbs,
          payment_per_round_trip,
          five_day_gross,
          full_week_option,
          reservation_fee,
          reservation_fee_refundable,
          broker_name,
          broker_usdot,
          broker_mc,
          pickup_date,
          delivery_date,
          load_details,
          load_status
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?, ?, ?, ?, 'assigned'
        )`,
        [
          loadTrackingId,
          Number(agreement_id),
          load_title.trim(),
          lane_type || "Dedicated Lane",
          contract_duration || null,
          pickup_location.trim(),
          delivery_location.trim(),
          return_pickup_location || null,
          return_delivery_location || null,
          round_trips_per_week ?? null,
          pickup_time || null,
          transit_details || null,
          one_way_miles ?? null,
          round_trip_miles ?? null,
          dead_miles ?? null,
          freight_details || null,
          load_weight_lbs ?? null,
          backhaul_weight_lbs ?? null,
          payment_per_round_trip ?? null,
          five_day_gross ?? null,
          full_week_option ? 1 : 0,
          reservation_fee ?? 0,
          reservation_fee_refundable ? 1 : 0,
          broker_name || null,
          broker_usdot || null,
          broker_mc || null,
          pickup_date || null,
          delivery_date || null,
          load_details || null,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Load assigned successfully.",
        load: {
          id: result.insertId,
          load_tracking_id: loadTrackingId,
          agreement_id: Number(agreement_id),
          load_title: load_title.trim(),
          load_status: "assigned",
        },
      });
    } catch (error) {
      console.error("Admin load assignment error:", error.message);

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          success: false,
          message: "Tracking ID conflict. Please try again.",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Unable to assign the load.",
      });
    }
  }
);

module.exports = router;