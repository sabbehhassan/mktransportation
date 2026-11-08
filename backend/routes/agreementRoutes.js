const express = require("express");
const router = express.Router();
const fs = require("fs");
const crypto = require("crypto");

const db = require("../db");
const generateAgreementPDF = require("../pdf/generateAgreementPDF");
const sendAgreementEmail = require("../email/sendAgreementEmail");

// Generate a unique Tracking ID
function generateTrackingId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const uniqueCode = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `SSL-${date}-${uniqueCode}`;
}

// Submit agreement
router.post("/submit-agreement", async (req, res) => {
  let pdfPath = null;
  let trackingId = null;
  let agreementSaved = false;

  try {
    const formData = req.body;

    console.log("AGREEMENT SUBMISSION RECEIVED");

    // Validate required fields
    if (
      !formData.email ||
      typeof formData.email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (
      !formData.carrierName ||
      typeof formData.carrierName !== "string" ||
      !formData.carrierName.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Carrier name is required.",
      });
    }

    if (!formData.paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required.",
      });
    }

    // Prepare values for MySQL
    const agreementDate =
      formData.agreementDate &&
      /^\d{4}-\d{2}-\d{2}$/.test(formData.agreementDate)
        ? formData.agreementDate
        : null;

    const selectedServices = Array.isArray(formData.selectedServices)
      ? JSON.stringify(formData.selectedServices)
      : JSON.stringify([]);

    // Generate Tracking ID and save agreement in database
    // Retry if a randomly generated Tracking ID already exists.
    let insertResult;
    let attempts = 0;

    while (attempts < 3) {
      trackingId = generateTrackingId();

      try {
        const [result] = await db.execute(
          `INSERT INTO agreements (
            tracking_id,
            agreement_type,
            selected_dispatch,
            agreement_date,
            carrier_name,
            company_name,
            mc_dot,
            phone,
            carrier_type,
            email,
            selected_services,
            payment_method,
            payment_terms_method,
            print_name,
            submission_status,
            deposit_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            trackingId,
            formData.agreementType || null,
            formData.selectedDispatch || null,
            agreementDate,
            formData.carrierName.trim(),
            formData.companyName || null,
            formData.mcDot || null,
            formData.phone || null,
            formData.carrierType || null,
            formData.email.trim(),
            selectedServices,
            formData.paymentMethod,
            formData.paymentTermsMethod || null,
            formData.printName || null,
            "processing",
            "pending",
          ]
        );

        insertResult = result;
        agreementSaved = true;
        break;
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY" && attempts < 2) {
          attempts++;
          continue;
        }

        throw error;
      }
    }

    if (!insertResult || !agreementSaved) {
      throw new Error("Could not save the agreement in the database.");
    }

    console.log("AGREEMENT SAVED. TRACKING ID:", trackingId);

    // Generate agreement PDF
    pdfPath = await generateAgreementPDF({
      ...formData,
      trackingId,
    });

    if (!pdfPath || !fs.existsSync(pdfPath)) {
      throw new Error("Agreement PDF could not be generated.");
    }

    console.log("PDF GENERATED SUCCESSFULLY");

    // Send agreement email with PDF attachment
    await sendAgreementEmail(formData.email.trim(), pdfPath, {
      ...formData,
      trackingId,
    });

    console.log("AGREEMENT EMAIL SENT SUCCESSFULLY");

    // Update database status after successful email
    await db.execute(
      `UPDATE agreements
       SET submission_status = ?
       WHERE tracking_id = ?`,
      ["submitted", trackingId]
    );

    return res.status(200).json({
      success: true,
      message: "Agreement submitted successfully.",
      trackingId,
    });
  } catch (error) {
    console.error("AGREEMENT SUBMISSION ERROR:", error.message);

    // Keep the saved record and mark it if PDF/email processing fails
    if (agreementSaved && trackingId) {
      try {
        await db.execute(
          `UPDATE agreements
           SET submission_status = ?
           WHERE tracking_id = ?`,
          ["processing_failed", trackingId]
        );
      } catch (dbError) {
        console.error("DATABASE STATUS UPDATE ERROR:", dbError.message);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Agreement submission failed. Please try again or contact support.",
      ...(trackingId ? { trackingId } : {}),
    });
  } finally {
    // Delete temporary PDF after processing
    if (pdfPath && fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
        console.log("TEMPORARY PDF DELETED");
      } catch (cleanupError) {
        console.error("PDF CLEANUP ERROR:", cleanupError.message);
      }
    }
  }
});

module.exports = router;