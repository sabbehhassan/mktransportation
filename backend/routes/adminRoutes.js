
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
        i.sent_at AS invoice_sent_at,
        (
          SELECT p.amount_received
          FROM deposit_payment_verifications p
          WHERE p.agreement_id = a.id AND p.status = 'verified'
          ORDER BY p.id DESC LIMIT 1
        ) AS deposit_amount_received,
        (
          SELECT p.payment_method
          FROM deposit_payment_verifications p
          WHERE p.agreement_id = a.id AND p.status = 'verified'
          ORDER BY p.id DESC LIMIT 1
        ) AS deposit_payment_method,
        (
          SELECT p.payment_date
          FROM deposit_payment_verifications p
          WHERE p.agreement_id = a.id AND p.status = 'verified'
          ORDER BY p.id DESC LIMIT 1
        ) AS deposit_payment_date,
        (
          SELECT p.payment_reference
          FROM deposit_payment_verifications p
          WHERE p.agreement_id = a.id AND p.status = 'verified'
          ORDER BY p.id DESC LIMIT 1
        ) AS deposit_payment_reference,
        (
          SELECT p.verified_at
          FROM deposit_payment_verifications p
          WHERE p.agreement_id = a.id AND p.status = 'verified'
          ORDER BY p.id DESC LIMIT 1
        ) AS deposit_verified_at,
        r.receipt_number AS refundable_receipt_number,
        r.status AS refundable_receipt_status,
        r.email_sent_at AS refundable_receipt_sent_at
      FROM agreements a
      LEFT JOIN invoices i ON i.id = (
        SELECT MAX(i2.id) FROM invoices i2 WHERE i2.agreement_id = a.id
      )
      LEFT JOIN refundable_receipts r ON r.invoice_id = i.id
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
      const payment = req.body?.payment || {};
      const replaceExistingVerification =
        req.body?.replace_existing_verification === true;

      // Validate agreement ID
      if (
        !/^\d+$/.test(id) ||
        !Number.isSafeInteger(Number(id)) ||
        Number(id) < 1
      ) {
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

      let verifiedPayment = null;
      let invoiceId = null;
      let amountReceived = null;
      let paymentMethod = "";
      let paymentDate = "";
      let paymentReference = "";
      if (deposit_status === "verified") {
        invoiceId = /^\d+$/.test(String(req.body?.invoice_id || ""))
          ? Number(req.body.invoice_id)
          : null;
        amountReceived = Number(payment.amountReceived);
        paymentMethod =
          typeof payment.method === "string"
            ? payment.method.replace(/[\u0000-\u001F\u007F]/g, "").trim()
            : "";
        paymentDate =
          typeof payment.date === "string" ? payment.date.trim() : "";
        paymentReference =
          typeof payment.reference === "string"
            ? payment.reference.replace(/[\u0000-\u001F\u007F]/g, "").trim()
            : "";
        const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(paymentDate)
          ? new Date(`${paymentDate}T00:00:00.000Z`)
          : null;

        if (
          !Number.isSafeInteger(invoiceId) ||
          invoiceId < 1 ||
          !Number.isFinite(amountReceived) ||
          amountReceived <= 0 ||
          amountReceived > 1000000 ||
          !paymentMethod ||
          paymentMethod.length > 100 ||
          !parsedDate ||
          Number.isNaN(parsedDate.getTime()) ||
          parsedDate.toISOString().slice(0, 10) !== paymentDate ||
          paymentReference.length > 160
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Enter a valid amount, payment method and payment date. Payment reference is optional.",
          });
        }
      }

      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
        const [existing] = await connection.query(
          "SELECT id, deposit_status FROM agreements WHERE id = ? FOR UPDATE",
          [Number(id)],
        );
        if (!existing.length) {
          await connection.rollback();
          return res.status(404).json({
            success: false,
            message: "Carrier agreement not found.",
          });
        }

        if (deposit_status === "verified") {
          const [invoices] = await connection.query(
            `SELECT id, status
             FROM invoices
             WHERE id = ? AND agreement_id = ?
             FOR UPDATE`,
            [invoiceId, Number(id)],
          );
          if (!invoices.length) {
            await connection.rollback();
            return res.status(404).json({
              success: false,
              message: "Invoice not found for this carrier agreement.",
            });
          }
          if (!["sent", "paid"].includes(invoices[0].status)) {
            await connection.rollback();
            return res.status(409).json({
              success: false,
              message: "Send the invoice successfully before verifying its deposit.",
            });
          }

          const [activePayments] = await connection.query(
            `SELECT id
             FROM deposit_payment_verifications
             WHERE agreement_id = ? AND status = 'verified'
             ORDER BY id DESC
             LIMIT 1
             FOR UPDATE`,
            [Number(id)],
          );
          if (activePayments.length && !replaceExistingVerification) {
            await connection.rollback();
            return res.status(409).json({
              success: false,
              message:
                "This deposit is already verified. Use Update Payment Record to intentionally replace its payment details.",
            });
          }

          await connection.query(
            `UPDATE deposit_payment_verifications
             SET status = 'revoked', revoked_by = ?, revoked_at = NOW()
             WHERE agreement_id = ? AND status = 'verified'`,
            [req.admin?.email || "admin", Number(id)],
          );
          const amountReceived =
            Math.round(Number(payment.amountReceived) * 100) / 100;
          const [inserted] = await connection.query(
            `INSERT INTO deposit_payment_verifications (
              agreement_id, amount_received, payment_method, payment_date,
              payment_reference, status, verified_by, verified_at
            ) VALUES (?, ?, ?, ?, ?, 'verified', ?, NOW())`,
            [
              Number(id),
              amountReceived,
              paymentMethod,
              paymentDate,
              paymentReference || null,
              req.admin?.email || "admin",
            ],
          );
          verifiedPayment = {
            id: inserted.insertId,
            amount_received: amountReceived,
            payment_method: paymentMethod,
            payment_date: paymentDate,
            payment_reference: paymentReference || null,
          };
        } else {
          await connection.query(
            `UPDATE deposit_payment_verifications
             SET status = 'revoked', revoked_by = ?, revoked_at = NOW()
             WHERE agreement_id = ? AND status = 'verified'`,
            [req.admin?.email || "admin", Number(id)],
          );
        }

        await connection.query(
          `UPDATE agreements
           SET deposit_status = ?, updated_at = NOW()
           WHERE id = ?`,
          [deposit_status, Number(id)],
        );
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }

      return res.status(200).json({
        success: true,
        message:
          deposit_status === "verified"
            ? "Deposit marked as verified."
            : "Deposit marked as pending.",
        agreement: {
          id: Number(id),
          invoice_id: invoiceId,
          deposit_status,
          payment: verifiedPayment,
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