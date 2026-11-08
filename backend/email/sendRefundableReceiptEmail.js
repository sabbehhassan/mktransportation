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

const sendRefundableReceiptEmail = async (receipt, pdfBuffer) => {
  const recipient = receipt.carrier.email;
  const companyName = receipt.company.companyName || company.name;
  const companyEmail = receipt.company.companyEmail || company.email;
  if (!recipient) {
    throw new Error("The agreement does not contain a carrier email address.");
  }

  const mailer = createTransporter();
  const result = await mailer.sendMail({
    from: `"${companyName}" <${process.env.EMAIL_FROM}>`,
    to: recipient,
    replyTo: companyEmail,
    subject: "Your Refundable Deposit Receipt – MKTransportation Group",
    text: [
      `Dear ${receipt.carrier.name || "Carrier"},`,
      "",
      "We have successfully received and verified your refundable deposit payment.",
      "Please find your official Refundable Deposit Receipt attached to this email for your records.",
      "",
      `Receipt number: ${receipt.receiptNumber}`,
      `Deposit amount: $${Number(receipt.payment.amountReceived).toFixed(2)}`,
      `Payment method: ${receipt.payment.method}`,
      "",
      "Thank you for choosing MKTransportation Group.",
      "",
      "Best Regards,",
      companyName,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#233b38;line-height:1.7;max-width:640px;margin:auto">
        <div style="background:#103c3a;color:#fff;padding:22px;border-radius:10px 10px 0 0">
          <strong style="font-size:20px">${escapeHtml(companyName)}</strong>
        </div>
        <div style="border:1px solid #dce7df;padding:24px;border-radius:0 0 10px 10px">
          <p>Dear ${escapeHtml(receipt.carrier.name || "Carrier")},</p>
          <p>We have successfully received and verified your refundable deposit payment.</p>
          <p>Please find your official Refundable Deposit Receipt attached to this email for your records.</p>
          <p><strong>Receipt:</strong> ${escapeHtml(receipt.receiptNumber)}<br>
          <strong>Amount received:</strong> $${Number(receipt.payment.amountReceived).toFixed(2)}<br>
          <strong>Payment method:</strong> ${escapeHtml(receipt.payment.method)}</p>
          <p>Thank you for choosing MKTransportation Group.</p>
          <p>Best Regards,<br><strong>${escapeHtml(companyName)}</strong></p>
        </div>
      </div>`,
    attachments: [
      {
        filename: `${receipt.receiptNumber}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  const acceptedRecipients = Array.isArray(result.accepted)
    ? result.accepted.map((address) => String(address).trim().toLowerCase())
    : [];
  if (!acceptedRecipients.includes(recipient.trim().toLowerCase())) {
    throw new Error("The mail server did not accept the carrier's email address.");
  }
};

module.exports = sendRefundableReceiptEmail;
