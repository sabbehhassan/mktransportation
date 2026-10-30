
const express = require("express");
const router = express.Router();
const db = require("../db");

// Look up an agreement using its exact tracking ID
router.get("/:trackingId", async (req, res) => {
  try {
    const trackingId = String(req.params.trackingId || "")
      .trim()
      .toUpperCase();

    if (!/^SSL-\d{8}-[A-F0-9]{8}$/.test(trackingId)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Agreement Tracking ID.",
      });
    }

    // Find agreement using tracking ID only
    const [agreements] = await db.execute(
      `SELECT
        id,
        tracking_id,
        agreement_type,
        selected_dispatch,
        agreement_date,
        carrier_name,
        company_name,
        carrier_type,
        submission_status,
        deposit_status,
        created_at
       FROM agreements
       WHERE tracking_id = ?
       LIMIT 1`,
      [trackingId]
    );

    if (!agreements.length) {
      return res.status(404).json({
        success: false,
        message: "No agreement was found with this Tracking ID.",
      });
    }

    const agreement = agreements[0];

    if (String(agreement.deposit_status || "").toLowerCase() !== "verified") {
      return res.status(403).json({
        success: false,
        message: "Your deposit has not been verified yet.",
      });
    }

    // Find a load linked to this exact agreement record
    const [loads] = await db.execute(
      `SELECT
        load_tracking_id,
        load_title,
        lane_type,
        contract_duration,
        pickup_location,
        delivery_location,
        return_pickup_location,
        return_delivery_location,
        pickup_date,
        delivery_date,
        pickup_time,
        transit_details,
        round_trips_per_week,
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
        load_details,
        load_status,
        assigned_at,
        updated_at
       FROM loads
       WHERE agreement_id = ?
       ORDER BY assigned_at DESC, id DESC
       LIMIT 1`,
      [agreement.id]
    );

    return res.status(200).json({
      success: true,
      message: loads.length
        ? "Verified agreement and load details retrieved successfully."
        : "Your agreement is verified, but a load has not been assigned yet.",
      agreement: {
        tracking_id: agreement.tracking_id,
        agreement_type: agreement.agreement_type,
        selected_dispatch: agreement.selected_dispatch,
        agreement_date: agreement.agreement_date,
        carrier_name: agreement.carrier_name,
        company_name: agreement.company_name,
        submission_status: agreement.submission_status,
        deposit_status: agreement.deposit_status,
        created_at: agreement.created_at,
      },
      load: loads[0] || null,
    });
  } catch (error) {
    console.error("TRACKING LOOKUP ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve tracking details right now.",
    });
  }
});

module.exports = router;