const company = require("../companyDetails");
const createTransporter = require("./createTransporter");

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const sendInvoiceEmail = async (invoice, pdfPath) => {
  if (!invoice.carrier.email) {
    throw new Error("The agreement does not contain a carrier email address.");
  }

  const transporter = createTransporter();

  const result = await transporter.sendMail({
    from: `"${company.name}" <${process.env.EMAIL_FROM}>`,
    to: invoice.carrier.email,
    replyTo: company.email,
    subject: `MKTransportation Group – Invoice #${invoice.invoiceNumber}`,
    text: [
      `Hello ${invoice.carrier.name || "Carrier"},`,
      "",
      `Please find attached invoice ${invoice.invoiceNumber} for $${invoice.total.toFixed(2)}.`,
      `Payment is due ${invoice.dueDate}.`,
      `Payment method: ${invoice.paymentMethod}.`,
      "",
      "Thank you,",
      company.name,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#233b38;line-height:1.7;max-width:640px;margin:auto">
        <div style="background:#103c3a;color:#fff;padding:22px;border-radius:10px 10px 0 0">
          <strong style="font-size:20px">${escapeHtml(company.name)}</strong>
        </div>
        <div style="border:1px solid #dce7df;padding:24px;border-radius:0 0 10px 10px">
          <p>Hello ${escapeHtml(invoice.carrier.name || "Carrier")},</p>
          <p>Your invoice <strong>${escapeHtml(invoice.invoiceNumber)}</strong> is attached.</p>
          <p><strong>Total due:</strong> $${invoice.total.toFixed(2)}<br>
          <strong>Due date:</strong> ${escapeHtml(invoice.dueDate)}<br>
          <strong>Payment method:</strong> ${escapeHtml(invoice.paymentMethod)}</p>
          <p>Please use the payment details in the attached invoice and include the invoice number with your payment.</p>
          <p>Thank you,<br><strong>${escapeHtml(company.name)}</strong><br>
          MC/MX/FF: ${escapeHtml(company.mcNumber)} | USDOT: ${escapeHtml(company.usdotNumber)}<br>
          ${escapeHtml(company.physicalAddress)}<br>
          <a href="mailto:${escapeHtml(company.email)}">${escapeHtml(company.email)}</a></p>
        </div>
      </div>`,
    attachments: [
      {
        filename: `${invoice.invoiceNumber}.pdf`,
        path: pdfPath,
        contentType: "application/pdf",
      },
    ],
  });

  const acceptedRecipients = Array.isArray(result.accepted)
    ? result.accepted.map((recipient) =>
        String(recipient).trim().toLowerCase(),
      )
    : [];
  if (
    !acceptedRecipients.includes(invoice.carrier.email.trim().toLowerCase())
  ) {
    throw new Error(
      "The mail server did not accept the carrier's email address.",
    );
  }
};

module.exports = sendInvoiceEmail;
