const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");

const db = require("../db");
const { buildInvoiceData } = require("../invoice/invoiceData");
const generateInvoicePDF = require("../pdf/generateInvoicePDF");
const sendInvoiceEmail = require("../email/sendInvoiceEmail");

const router = express.Router();
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const getAgreementId = (value) => {
  if (!/^\d+$/.test(String(value || ""))) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const getAgreement = async (id) => {
  const [rows] = await db.query(
    `SELECT id, tracking_id, agreement_type, selected_dispatch, carrier_name,
            company_name, mc_dot, phone, carrier_type, email, selected_services,
            payment_terms_method, print_name
     FROM agreements WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] || null;
};

const getInvoice = async (id) => {
  const [rows] = await db.query(
    `SELECT id, agreement_id, tracking_id, invoice_number, status,
            invoice_data, sent_at, created_at, updated_at
     FROM invoices WHERE id = ? LIMIT 1`,
    [id],
  );
  if (!rows.length) return null;
  try {
    return { ...rows[0], invoice_data: JSON.parse(rows[0].invoice_data) };
  } catch {
    throw new Error("The stored invoice data is invalid.");
  }
};

const createInvoiceNumber = () =>
  `MKT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;

const createPdfFile = async (invoice) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "mk-invoice-"));
  const filePath = path.join(directory, `${invoice.invoiceNumber}.pdf`);
  try {
    await generateInvoicePDF(invoice, filePath);
    return { directory, filePath };
  } catch (error) {
    fs.rmSync(directory, { recursive: true, force: true });
    throw error;
  }
};

const removePdfFile = (file) => {
  if (file?.directory) fs.rmSync(file.directory, { recursive: true, force: true });
};

const sendStoredInvoice = async (invoice) => {
  const file = await createPdfFile(invoice);
  try {
    await sendInvoiceEmail(invoice, file.filePath);
  } finally {
    removePdfFile(file);
  }
};

const validateAgreementEmail = (agreement) =>
  typeof agreement.email === "string" && validEmail.test(agreement.email);

router.get("/agreements/:agreementId", async (req, res) => {
  try {
    const agreementId = getAgreementId(req.params.agreementId);
    if (!agreementId) {
      return res.status(400).json({ success: false, message: "Invalid agreement ID." });
    }

    const agreement = await getAgreement(agreementId);
    if (!agreement) {
      return res.status(404).json({ success: false, message: "Carrier agreement not found." });
    }

    const [existingInvoices] = await db.query(
      `SELECT id, invoice_number, status, sent_at, created_at, invoice_data
       FROM invoices WHERE agreement_id = ? ORDER BY id DESC`,
      [agreementId],
    );
    for (const invoice of existingInvoices) {
      try {
        invoice.invoice_data = JSON.parse(invoice.invoice_data);
      } catch {
        throw new Error("The stored invoice data is invalid.");
      }
    }
    return res.json({
      success: true,
      agreement,
      invoice: existingInvoices[0] || null,
      invoices: existingInvoices,
      paymentMethodSuggestion: agreement.payment_terms_method || "",
    });
  } catch (error) {
    console.error("Admin invoice data fetch error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to load invoice data." });
  }
});

router.post("/agreements/:agreementId/preview", async (req, res) => {
  try {
    const agreementId = getAgreementId(req.params.agreementId);
    if (!agreementId) {
      return res.status(400).json({ success: false, message: "Invalid agreement ID." });
    }
    const agreement = await getAgreement(agreementId);
    if (!agreement) {
      return res.status(404).json({ success: false, message: "Carrier agreement not found." });
    }
    if (!validateAgreementEmail(agreement)) {
      return res.status(400).json({ success: false, message: "The agreement does not contain a valid carrier email." });
    }

    const invoice = buildInvoiceData(agreement, req.body || {}, "MKT-PREVIEW");
    const pdf = await generateInvoicePDF(invoice);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="invoice-preview.pdf"',
      "Cache-Control": "private, no-store",
    });
    return res.send(pdf);
  } catch (error) {
    console.error("Admin invoice preview error:", error.message);
    return res.status(400).json({ success: false, message: error.message || "Unable to generate invoice preview." });
  }
});

router.post("/agreements/:agreementId", async (req, res) => {
  let insertedInvoiceId;
  let invoice;
  try {
    const agreementId = getAgreementId(req.params.agreementId);
    if (!agreementId) {
      return res.status(400).json({ success: false, message: "Invalid agreement ID." });
    }
    const agreement = await getAgreement(agreementId);
    if (!agreement) {
      return res.status(404).json({ success: false, message: "Carrier agreement not found." });
    }
    if (!validateAgreementEmail(agreement)) {
      return res.status(400).json({ success: false, message: "The agreement does not contain a valid carrier email." });
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(503).json({ success: false, message: "Invoice email delivery is not configured." });
    }

    invoice = buildInvoiceData(agreement, req.body || {}, createInvoiceNumber());
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      await connection.query(
        "SELECT id FROM agreements WHERE id = ? FOR UPDATE",
        [agreementId],
      );
      const [activeInvoices] = await connection.query(
        `SELECT id FROM invoices
         WHERE agreement_id = ? AND status IN ('pending', 'sent')
         LIMIT 1`,
        [agreementId],
      );
      if (activeInvoices.length) {
        await connection.rollback();
        return res.status(409).json({
          success: false,
          message: "This agreement already has an unpaid invoice. Open its invoice history before creating another.",
        });
      }
      const [result] = await connection.query(
        `INSERT INTO invoices (
          agreement_id, tracking_id, invoice_number, status, invoice_data, email_lock_at
         ) VALUES (?, ?, ?, 'pending', ?, NOW())`,
        [agreementId, agreement.tracking_id, invoice.invoiceNumber, JSON.stringify(invoice)],
      );
      insertedInvoiceId = result.insertId;
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

    await sendStoredInvoice(invoice);
    await db.query(
      "UPDATE invoices SET status = 'sent', sent_at = NOW(), email_lock_at = NULL WHERE id = ?",
      [insertedInvoiceId],
    );

    return res.status(201).json({
      success: true,
      message: "Invoice sent successfully.",
      invoice: {
        id: insertedInvoiceId,
        invoice_number: invoice.invoiceNumber,
        status: "sent",
        sent_at: new Date().toISOString(),
        invoice_data: invoice,
      },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "An invoice already exists for this agreement. Open its invoice history to view or resend it.",
      });
    }
    console.error("Admin invoice send error:", error.message);
    if (insertedInvoiceId) {
      try {
        await db.query(
          "UPDATE invoices SET email_lock_at = NULL WHERE id = ?",
          [insertedInvoiceId],
        );
      } catch (updateError) {
        console.error("Unable to clear pending invoice delivery lock:", updateError.message);
      }
      return res.status(502).json({
        success: false,
        message: `Invoice saved as pending, but delivery failed: ${error.message}`,
        invoice: {
          id: insertedInvoiceId,
          invoice_number: invoice.invoiceNumber,
          status: "pending",
          invoice_data: invoice,
        },
      });
    }
    return res.status(400).json({ success: false, message: error.message || "Unable to send invoice." });
  }
});

router.get("/:invoiceId/pdf", async (req, res) => {
  try {
    const invoiceId = getAgreementId(req.params.invoiceId);
    if (!invoiceId) {
      return res.status(400).json({ success: false, message: "Invalid invoice ID." });
    }
    const invoice = await getInvoice(invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found." });
    }
    const pdf = await generateInvoicePDF(invoice.invoice_data);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoice_number}.pdf"`,
      "Cache-Control": "private, no-store",
    });
    return res.send(pdf);
  } catch (error) {
    console.error("Admin invoice PDF error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to generate invoice PDF." });
  }
});

router.post("/:invoiceId/resend", async (req, res) => {
  try {
    const invoiceId = getAgreementId(req.params.invoiceId);
    if (!invoiceId) {
      return res.status(400).json({ success: false, message: "Invalid invoice ID." });
    }
    const invoice = await getInvoice(invoiceId);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found." });
    }
    if (["paid", "cancelled"].includes(invoice.status)) {
      return res.status(409).json({ success: false, message: `A ${invoice.status} invoice cannot be resent.` });
    }
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(503).json({ success: false, message: "Invoice email delivery is not configured." });
    }
    const [claimed] = await db.query(
      `UPDATE invoices
       SET email_lock_at = NOW()
       WHERE id = ?
         AND status IN ('pending', 'sent')
         AND (email_lock_at IS NULL OR email_lock_at < DATE_SUB(NOW(), INTERVAL 10 MINUTE))`,
      [invoiceId],
    );
    if (!claimed.affectedRows) {
      return res.status(409).json({
        success: false,
        message: "This invoice is already being sent. Wait a few minutes before retrying.",
      });
    }

    try {
      await sendStoredInvoice(invoice.invoice_data);
    } catch (error) {
      await db.query("UPDATE invoices SET email_lock_at = NULL WHERE id = ?", [invoiceId]);
      throw error;
    }
    await db.query(
      "UPDATE invoices SET status = 'sent', sent_at = NOW(), email_lock_at = NULL WHERE id = ?",
      [invoiceId],
    );
    return res.json({
      success: true,
      message: "Invoice resent successfully.",
      invoice: { id: invoiceId, status: "sent", sent_at: new Date().toISOString() },
    });
  } catch (error) {
    console.error("Admin invoice resend error:", error.message);
    return res.status(502).json({
      success: false,
      message: `Invoice email delivery failed: ${error.message}`,
    });
  }
});

router.patch("/:invoiceId/status", async (req, res) => {
  try {
    const invoiceId = getAgreementId(req.params.invoiceId);
    const { status } = req.body || {};
    if (!invoiceId || !["paid", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Choose a valid invoice status." });
    }
    const [result] = await db.query(
      `UPDATE invoices SET status = ?
       WHERE id = ? AND status IN ('pending', 'sent', 'paid')`,
      [status, invoiceId],
    );
    if (!result.affectedRows) {
      const invoice = await getInvoice(invoiceId);
      if (!invoice) {
        return res.status(404).json({ success: false, message: "Invoice not found." });
      }
      if (invoice.status === "cancelled") {
        return res.status(409).json({ success: false, message: "A cancelled invoice cannot be changed." });
      }
    }
    return res.json({ success: true, invoice: { id: invoiceId, status } });
  } catch (error) {
    console.error("Admin invoice status update error:", error.message);
    return res.status(500).json({ success: false, message: "Unable to update invoice status." });
  }
});

module.exports = router;
