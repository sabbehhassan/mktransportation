const express = require("express");
const crypto = require("crypto");

const db = require("../db");
const generateRefundableReceiptPDF = require("../pdf/generateRefundableReceiptPDF");
const sendRefundableReceiptEmail = require("../email/sendRefundableReceiptEmail");
const {
  cleanText,
  getReceiptSettings,
  saveReceiptSettings,
} = require("../receipts/refundableReceiptSettings");

const router = express.Router();
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const getId = (value) => {
  if (!/^\d+$/.test(String(value || ""))) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const getAdminEmail = (req) => req.admin?.email || "admin";

const parseReceipt = (row) => {
  if (!row) return null;
  let receiptData;
  try {
    receiptData =
      typeof row.receipt_data === "string"
        ? JSON.parse(row.receipt_data)
        : row.receipt_data;
  } catch {
    throw new Error("The stored refundable receipt data is invalid.");
  }
  return {
    id: row.id,
    invoice_id: row.invoice_id,
    agreement_id: row.agreement_id,
    receipt_number: row.receipt_number,
    status: row.status,
    email_sent_to: row.email_sent_to,
    email_sent_at: row.email_sent_at,
    created_by_admin: row.created_by_admin,
    created_at: row.created_at,
    updated_at: row.updated_at,
    receipt_data: receiptData,
  };
};

const getReceiptRow = async (invoiceId) => {
  const [rows] = await db.query(
    `SELECT id, invoice_id, agreement_id, receipt_number, status,
            email_sent_to, email_sent_at, created_by_admin, created_at,
            updated_at, receipt_data
     FROM refundable_receipts WHERE invoice_id = ? LIMIT 1`,
    [invoiceId],
  );
  return rows[0] || null;
};

const getInvoiceAndAgreement = async (invoiceId) => {
  const [rows] = await db.query(
    `SELECT i.id AS invoice_id, i.agreement_id, i.invoice_number,
            i.status AS invoice_status, i.invoice_data,
            a.id AS agreement_record_id, a.tracking_id, a.agreement_type,
            a.carrier_name, a.company_name, a.email, a.phone, a.mc_dot,
            a.deposit_status, a.carrier_type
     FROM invoices i
     JOIN agreements a ON a.id = i.agreement_id
     WHERE i.id = ? LIMIT 1`,
    [invoiceId],
  );
  return rows[0] || null;
};

const getVerifiedPayment = async (agreementId, verificationId = null) => {
  const [rows] = await db.query(
    `SELECT id, amount_received, payment_method, payment_date,
            payment_reference, verified_by, verified_at
     FROM deposit_payment_verifications
     WHERE agreement_id = ? AND status = 'verified'
       ${verificationId ? "AND id = ?" : ""}
     ORDER BY id DESC LIMIT 1`,
    verificationId ? [agreementId, verificationId] : [agreementId],
  );
  return rows[0] || null;
};

const mapPaymentDate = (value) => {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value || "").slice(0, 10);
};

const createReceiptNumber = () =>
  `MKT-RCP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase()}`;

const addReceiptEvent = async (
  connection,
  receiptId,
  eventType,
  adminEmail,
  detail = null,
) => {
  await connection.query(
    `INSERT INTO refundable_receipt_events
       (receipt_id, event_type, admin_email, detail)
     VALUES (?, ?, ?, ?)`,
    [receiptId, eventType, adminEmail, detail],
  );
};

const buildReceiptData = ({
  invoice,
  payment,
  settings,
  receiptNumber,
  refundPolicy,
}) => {
  let invoiceData;
  try {
    invoiceData =
      typeof invoice.invoice_data === "string"
        ? JSON.parse(invoice.invoice_data)
        : invoice.invoice_data;
  } catch {
    throw new Error("The stored invoice data is invalid.");
  }
  const carrier = invoiceData?.carrier || {};
  const email = String(invoice.email || carrier.email || "").trim();
  if (!validEmail.test(email)) {
    throw new Error("The agreement does not contain a valid carrier email address.");
  }

  return {
    receiptNumber,
    issuedDate: new Date().toISOString().slice(0, 10),
    invoiceNumber: invoice.invoice_number,
    trackingId: invoice.tracking_id,
    carrier: {
      name: invoice.carrier_name || carrier.name || "",
      company: invoice.company_name || carrier.company || "",
      email,
      phone: invoice.phone || carrier.phone || "",
      mcDot: invoice.mc_dot || carrier.mcDot || "",
    },
    payment: {
      amountReceived: Number(payment.amount_received),
      method: payment.payment_method,
      date: mapPaymentDate(payment.payment_date),
      reference: payment.payment_reference || "",
    },
    refundPolicy,
    company: {
      companyName: settings.companyName,
      companyBrand: settings.companyBrand,
      companyWebsite: settings.companyWebsite,
      companyEmail: settings.companyEmail,
      companyPhone: settings.companyPhone,
      physicalAddress: settings.physicalAddress,
      mailingAddress: settings.mailingAddress,
      mcNumber: settings.mcNumber,
      usdotNumber: settings.usdotNumber,
      logoDataUrl: settings.logoDataUrl,
    },
    authorization: {
      name: settings.authorizedName,
      position: settings.authorizedPosition,
      signatureDataUrl: settings.signatureDataUrl,
    },
  };
};

router.get("/settings", async (req, res) => {
  try {
    return res.json({
      success: true,
      settings: await getReceiptSettings(),
    });
  } catch (error) {
    console.error("Refundable receipt settings fetch error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to load refundable receipt settings.",
    });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const settings = await saveReceiptSettings(
      req.body || {},
      getAdminEmail(req),
    );
    return res.json({
      success: true,
      message: "Refundable receipt settings saved.",
      settings,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to save refundable receipt settings.",
    });
  }
});

router.get("/:invoiceId/receipt", async (req, res) => {
  try {
    const invoiceId = getId(req.params.invoiceId);
    if (!invoiceId) {
      return res.status(400).json({ success: false, message: "Invalid invoice ID." });
    }
    const invoice = await getInvoiceAndAgreement(invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found." });
    }
    const [paymentHistory] = await db.query(
      `SELECT id, amount_received, payment_method, payment_date,
              payment_reference, status, verified_by, verified_at,
              revoked_by, revoked_at
       FROM deposit_payment_verifications
       WHERE agreement_id = ?
       ORDER BY id DESC`,
      [invoice.agreement_id],
    );
    const currentPayment =
      paymentHistory[0]?.status === "verified" ? paymentHistory[0] : null;
    const row = await getReceiptRow(invoiceId);
    const receipt = parseReceipt(row);
    const events = receipt
      ? (
          await db.query(
            `SELECT event_type, admin_email, detail, created_at
             FROM refundable_receipt_events
             WHERE receipt_id = ? ORDER BY id DESC`,
            [receipt.id],
          )
        )[0]
      : [];
    return res.json({
      success: true,
      agreement: {
        id: invoice.agreement_record_id,
        tracking_id: invoice.tracking_id,
        deposit_status: invoice.deposit_status,
        carrier_name: invoice.carrier_name,
        company_name: invoice.company_name,
        email: invoice.email,
        phone: invoice.phone,
        mc_dot: invoice.mc_dot,
        agreement_type: invoice.agreement_type,
      },
      invoice: {
        id: invoice.invoice_id,
        invoice_number: invoice.invoice_number,
        status: invoice.invoice_status,
      },
      payment:
        String(invoice.deposit_status).toLowerCase() === "verified"
          ? currentPayment
          : null,
      paymentHistory,
      settings: await getReceiptSettings(),
      receipt,
      events,
    });
  } catch (error) {
    console.error("Refundable receipt context error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to load refundable receipt information.",
    });
  }
});

router.post("/:invoiceId/receipt/preview", async (req, res) => {
  let connection;
  try {
    const invoiceId = getId(req.params.invoiceId);
    if (!invoiceId) {
      return res.status(400).json({ success: false, message: "Invalid invoice ID." });
    }
    const refundPolicy = cleanText(
      req.body?.refundPolicy,
      "Refund policy",
      6000,
      { required: true },
    );
    const settings = await getReceiptSettings();
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [invoiceRows] = await connection.query(
      `SELECT i.id AS invoice_id, i.agreement_id, i.invoice_number,
              i.status AS invoice_status, i.invoice_data,
              a.id AS agreement_record_id, a.tracking_id, a.agreement_type,
              a.carrier_name, a.company_name, a.email, a.phone, a.mc_dot,
              a.deposit_status, a.carrier_type
       FROM invoices i JOIN agreements a ON a.id = i.agreement_id
       WHERE i.id = ? FOR UPDATE`,
      [invoiceId],
    );
    if (!invoiceRows.length) {
      await connection.rollback();
      connection.release();
      connection = null;
      return res.status(404).json({ success: false, message: "Invoice not found." });
    }
    const invoice = invoiceRows[0];
    if (String(invoice.deposit_status).toLowerCase() !== "verified") {
      await connection.rollback();
      connection.release();
      connection = null;
      return res.status(403).json({
        success: false,
        message: "Manually verify the deposit before generating its refundable receipt.",
      });
    }
    if (invoice.invoice_status === "cancelled") {
      await connection.rollback();
      connection.release();
      connection = null;
      return res.status(409).json({
        success: false,
        message: "A cancelled invoice cannot receive a refundable deposit receipt.",
      });
    }
    const [paymentRows] = await connection.query(
      `SELECT id, amount_received, payment_method, payment_date,
              payment_reference, verified_by, verified_at
       FROM deposit_payment_verifications
       WHERE agreement_id = ? AND status = 'verified'
       ORDER BY id DESC LIMIT 1 FOR UPDATE`,
      [invoice.agreement_id],
    );
    if (!paymentRows.length) {
      await connection.rollback();
      connection.release();
      connection = null;
      return res.status(409).json({
        success: false,
        message:
          "No verified payment record exists. Update the agreement's verified payment details before creating a receipt.",
      });
    }
    const payment = paymentRows[0];
    const [receiptRows] = await connection.query(
      `SELECT id, receipt_number, status
       FROM refundable_receipts WHERE invoice_id = ? FOR UPDATE`,
      [invoiceId],
    );
    const existing = receiptRows[0] || null;
    if (existing?.status === "sent") {
      await connection.commit();
      connection.release();
      connection = null;
      const pdf = await getReceiptPdf(existing.id);
      return sendReceiptPdf(res, pdf, existing.receipt_number, false);
    }
    const receiptNumber = existing?.receipt_number || createReceiptNumber();
    const receiptData = buildReceiptData({
      invoice,
      payment,
      settings,
      receiptNumber,
      refundPolicy,
    });
    let receiptId = existing?.id;
    if (existing) {
      await connection.query(
        `UPDATE refundable_receipts
         SET deposit_verification_id = ?, amount_received = ?, payment_method = ?,
             payment_date = ?, payment_reference = ?, receipt_data = ?,
             pdf_data = NULL, status = 'draft', last_error = NULL
         WHERE id = ?`,
        [
          payment.id,
          payment.amount_received,
          payment.payment_method,
          mapPaymentDate(payment.payment_date),
          payment.payment_reference || null,
          JSON.stringify(receiptData),
          receiptId,
        ],
      );
    } else {
      const [inserted] = await connection.query(
        `INSERT INTO refundable_receipts (
          invoice_id, agreement_id, deposit_verification_id, receipt_number,
          amount_received, payment_method, payment_date, payment_reference,
          receipt_data, status, created_by_admin
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
        [
          invoiceId,
          invoice.agreement_id,
          payment.id,
          receiptNumber,
          payment.amount_received,
          payment.payment_method,
          mapPaymentDate(payment.payment_date),
          payment.payment_reference || null,
          JSON.stringify(receiptData),
          getAdminEmail(req),
        ],
      );
      receiptId = inserted.insertId;
      await addReceiptEvent(
        connection,
        receiptId,
        "draft_created",
        getAdminEmail(req),
        "Refundable receipt draft created.",
      );
    }
    if (existing) {
      await addReceiptEvent(
        connection,
        receiptId,
        "preview_generated",
        getAdminEmail(req),
        "Refundable receipt preview generated.",
      );
    }
    await connection.commit();
    connection.release();
    connection = null;

    const pdf = await generateRefundableReceiptPDF(receiptData);
    await db.query(
      "UPDATE refundable_receipts SET pdf_data = ? WHERE id = ?",
      [pdf, receiptId],
    );
    return sendReceiptPdf(res, pdf, receiptNumber, false);
  } catch (error) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Refundable receipt preview error:", error.message);
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to generate refundable receipt preview.",
    });
  }
});

const getReceiptPdf = async (receiptId) => {
  const [rows] = await db.query(
    "SELECT receipt_number, receipt_data, pdf_data FROM refundable_receipts WHERE id = ? LIMIT 1",
    [receiptId],
  );
  if (!rows.length) throw new Error("Refundable receipt not found.");
  if (rows[0].pdf_data) return rows[0].pdf_data;
  const receiptData =
    typeof rows[0].receipt_data === "string"
      ? JSON.parse(rows[0].receipt_data)
      : rows[0].receipt_data;
  const pdf = await generateRefundableReceiptPDF(receiptData);
  await db.query(
    "UPDATE refundable_receipts SET pdf_data = ? WHERE id = ?",
    [pdf, receiptId],
  );
  return pdf;
};

const sendReceiptPdf = (res, pdf, receiptNumber, download) => {
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${receiptNumber}.pdf"`,
    "Cache-Control": "private, no-store",
  });
  return res.send(pdf);
};

router.get("/:invoiceId/receipt/pdf", async (req, res) => {
  try {
    const invoiceId = getId(req.params.invoiceId);
    if (!invoiceId) {
      return res.status(400).json({ success: false, message: "Invalid invoice ID." });
    }
    const row = await getReceiptRow(invoiceId);
    if (!row) {
      return res.status(404).json({ success: false, message: "Refundable receipt not found." });
    }
    const pdf = await getReceiptPdf(row.id);
    return sendReceiptPdf(
      res,
      pdf,
      row.receipt_number,
      req.query.download === "1",
    );
  } catch (error) {
    console.error("Refundable receipt PDF error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to load the refundable receipt PDF.",
    });
  }
});

router.post("/:invoiceId/receipt/send", async (req, res) => {
  let receipt;
  let claimed = false;
  let emailAccepted = false;
  try {
    const invoiceId = getId(req.params.invoiceId);
    if (!invoiceId) {
      return res.status(400).json({ success: false, message: "Invalid invoice ID." });
    }
    if (req.body?.refundPolicyReviewed !== true) {
      return res.status(400).json({
        success: false,
        message: "Review and confirm the refund policy before sending the receipt.",
      });
    }
    const row = await getReceiptRow(invoiceId);
    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Generate a receipt preview before sending it.",
      });
    }
    if (row.status === "sent") {
      return res.status(409).json({
        success: false,
        message: "This receipt has already been sent. Use Resend Refundable Slip if needed.",
      });
    }
    receipt = parseReceipt(row).receipt_data;
    if (
      !receipt.authorization?.name ||
      !receipt.authorization?.position ||
      !receipt.authorization?.signatureDataUrl
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Configure the authorized representative name, job title, and approved signature before sending.",
      });
    }
    if (!receipt.refundPolicy?.trim()) {
      return res.status(400).json({
        success: false,
        message: "A reviewed refund policy is required before sending.",
      });
    }
    const [invoiceRows] = await db.query(
      `SELECT i.status AS invoice_status, i.agreement_id, a.deposit_status
       FROM invoices i JOIN agreements a ON a.id = i.agreement_id
       WHERE i.id = ? LIMIT 1`,
      [invoiceId],
    );
    if (!invoiceRows.length) {
      return res.status(404).json({ success: false, message: "Invoice not found." });
    }
    if (Number(invoiceRows[0].agreement_id) !== Number(row.agreement_id)) {
      return res.status(409).json({
        success: false,
        message: "This receipt does not match the invoice's carrier agreement.",
      });
    }
    if (!["sent", "paid"].includes(invoiceRows[0].invoice_status)) {
      return res.status(409).json({
        success: false,
        message: "Send the invoice successfully before issuing a refundable receipt.",
      });
    }
    if (String(invoiceRows[0].deposit_status).toLowerCase() !== "verified") {
      return res.status(403).json({
        success: false,
        message: "The deposit is no longer verified. Re-verify it before sending this receipt.",
      });
    }
    const verifiedPayment = await getVerifiedPayment(
      row.agreement_id,
      row.deposit_verification_id,
    );
    if (!verifiedPayment) {
      return res.status(403).json({
        success: false,
        message: "The verified payment record for this receipt is no longer active.",
      });
    }
    const [claim] = await db.query(
      `UPDATE refundable_receipts
       SET email_lock_at = NOW()
       WHERE id = ? AND status IN ('draft', 'failed')
         AND (email_lock_at IS NULL OR email_lock_at < DATE_SUB(NOW(), INTERVAL 10 MINUTE))`,
      [row.id],
    );
    if (!claim.affectedRows) {
      return res.status(409).json({
        success: false,
        message: "This receipt is already being sent or has already been sent.",
      });
    }
    claimed = true;
    const pdf = await getReceiptPdf(row.id);
    await sendRefundableReceiptEmail(receipt, pdf);
    emailAccepted = true;

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        `UPDATE refundable_receipts
         SET status = 'sent', email_sent_to = ?, email_sent_at = NOW(),
             email_lock_at = NULL, last_error = NULL
         WHERE id = ?`,
        [receipt.carrier.email, row.id],
      );
      await addReceiptEvent(
        connection,
        row.id,
        "sent",
        getAdminEmail(req),
        `Receipt sent after refund policy review to ${receipt.carrier.email}.`,
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      if (emailAccepted) {
        try {
          await db.query(
            `UPDATE refundable_receipts
             SET status = 'sent', email_sent_to = ?, email_sent_at = NOW(),
                 email_lock_at = NULL, last_error = NULL
             WHERE id = ?`,
            [receipt.carrier.email, row.id],
          );
        } catch (persistError) {
          console.error("Unable to persist accepted refundable receipt delivery:", persistError.message);
        }
      }
      throw new Error(
        `The email provider accepted the receipt, but its sent status could not be saved. Do not retry until you confirm delivery. ${error.message}`,
      );
    } finally {
      connection.release();
    }
    return res.json({
      success: true,
      message: "Refundable receipt sent successfully.",
      receipt: {
        id: row.id,
        invoice_id: row.invoice_id,
        receipt_number: row.receipt_number,
        status: "sent",
        email_sent_to: receipt.carrier.email,
        email_sent_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Refundable receipt send error:", error.message);
    if (claimed && !emailAccepted) {
      const [rows] = await db.query(
        "SELECT id, receipt_number FROM refundable_receipts WHERE invoice_id = ? LIMIT 1",
        [Number(req.params.invoiceId)],
      );
      if (rows.length) {
        const connection = await db.getConnection();
        try {
          await connection.beginTransaction();
          await connection.query(
            `UPDATE refundable_receipts
             SET status = 'failed', email_lock_at = NULL, last_error = ?
             WHERE id = ? AND status <> 'sent'`,
            [String(error.message || "Delivery failed").slice(0, 1000), rows[0].id],
          );
          await addReceiptEvent(
            connection,
            rows[0].id,
            "failed",
            getAdminEmail(req),
            "Receipt email delivery failed; retry is available.",
          );
          await connection.commit();
        } catch (updateError) {
          await connection.rollback();
          console.error("Unable to record refundable receipt delivery failure:", updateError.message);
        } finally {
          connection.release();
        }
      }
    }
    return res.status(502).json({
      success: false,
      message: `Refundable receipt email delivery failed: ${error.message}`,
    });
  }
});

router.post("/:invoiceId/receipt/resend", async (req, res) => {
  const invoiceId = getId(req.params.invoiceId);
  if (!invoiceId) {
    return res.status(400).json({ success: false, message: "Invalid invoice ID." });
  }
  try {
    const row = await getReceiptRow(invoiceId);
    if (!row || row.status !== "sent") {
      return res.status(409).json({
        success: false,
        message: "Only a previously sent refundable receipt can be resent.",
      });
    }
    const receipt = parseReceipt(row).receipt_data;
    const [claim] = await db.query(
      `UPDATE refundable_receipts
       SET email_lock_at = NOW()
       WHERE id = ? AND status = 'sent'
         AND (email_lock_at IS NULL OR email_lock_at < DATE_SUB(NOW(), INTERVAL 10 MINUTE))`,
      [row.id],
    );
    if (!claim.affectedRows) {
      return res.status(409).json({
        success: false,
        message: "This receipt is already being sent. Wait before trying again.",
      });
    }

    let emailAccepted = false;
    try {
      await sendRefundableReceiptEmail(receipt, await getReceiptPdf(row.id));
      emailAccepted = true;
    } catch (error) {
      await db.query(
        `UPDATE refundable_receipts
         SET email_lock_at = NULL, last_error = ? WHERE id = ?`,
        [String(error.message || "Delivery failed").slice(0, 1000), row.id],
      );
      const connection = await db.getConnection();
      try {
        await addReceiptEvent(
          connection,
          row.id,
          "resend_failed",
          getAdminEmail(req),
          "Receipt resend failed; the original sent receipt remains available.",
        );
      } finally {
        connection.release();
      }
      throw error;
    }
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        `UPDATE refundable_receipts
         SET email_sent_to = ?, email_sent_at = NOW(),
             email_lock_at = NULL, last_error = NULL
         WHERE id = ?`,
        [receipt.carrier.email, row.id],
      );
      await addReceiptEvent(
        connection,
        row.id,
        "resent",
        getAdminEmail(req),
        `Receipt resent to ${receipt.carrier.email}.`,
      );
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      if (emailAccepted) {
        try {
          await db.query(
            `UPDATE refundable_receipts
             SET email_sent_to = ?, email_sent_at = NOW(),
                 email_lock_at = NULL, last_error = NULL
             WHERE id = ?`,
            [receipt.carrier.email, row.id],
          );
        } catch (persistError) {
          console.error("Unable to persist accepted refundable receipt resend:", persistError.message);
        }
      }
      throw new Error(
        `The email provider accepted the receipt, but its resend status could not be saved. ${error.message}`,
      );
    } finally {
      connection.release();
    }
    return res.json({
      success: true,
      message: "Refundable receipt resent successfully.",
      receipt: {
        id: row.id,
        invoice_id: row.invoice_id,
        receipt_number: row.receipt_number,
        status: "sent",
        email_sent_to: receipt.carrier.email,
        email_sent_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Refundable receipt resend error:", error.message);
    return res.status(502).json({
      success: false,
      message: `Refundable receipt resend failed: ${error.message}`,
    });
  }
});

module.exports = router;
