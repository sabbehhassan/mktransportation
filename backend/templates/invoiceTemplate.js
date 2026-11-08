const fs = require("fs");
const path = require("path");
const company = require("../companyDetails");

const logoBase64 = fs.readFileSync(
  path.join(__dirname, "../public/logo.png"),
  "base64",
);

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

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);

const formatDate = (value) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? escapeHtml(value)
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
};

module.exports = (invoice) => {
  const carrier = invoice.carrier;
  const payment = invoice.payment || {};
  const paymentMethod =
    invoice.paymentMethod || payment.method || "Payment method not specified";
  const paymentFields = [
    ["Account holder / business name", payment.accountHolder || payment.accountName],
    ["Payment email / account ID", payment.accountId || payment.account],
    ["Bank name", payment.bankName],
    ["Routing number", payment.routingNumber],
    ["Account number", payment.accountNumber],
    ["Additional payment instructions", payment.instructions || invoice.paymentInstructions],
  ].filter(([, value]) => String(value || "").trim());
  const serviceRows = invoice.services
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.description)}</td>
          <td class="numeric">${item.quantity}</td>
          <td class="numeric">${formatCurrency(item.rate)}</td>
          <td class="numeric">${formatCurrency(item.quantity * item.rate)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <style>
      @page { size: A4 portrait; margin: 8mm; }
      * { box-sizing: border-box; }
      html, body { width: 100%; margin: 0; color: #233b38; font: 9px Arial, sans-serif; }
      .page { width: 100%; padding: 0; }
      .top { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #17665b; padding-bottom: 8px; }
      .brand { display: flex; gap: 9px; align-items: center; }
      .logo { width: 56px; height: 44px; object-fit: contain; }
      h1 { margin: 0 0 3px; color: #103c3a; font-size: 18px; }
      .company, .muted { color: #647773; line-height: 1.35; }
      .invoice-heading { color: #17665b; font-size: 21px; font-weight: 800; text-align: right; }
      .invoice-meta { margin-top: 4px; text-align: right; line-height: 1.5; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0 8px; }
      .card { border: 1px solid #dce7df; border-radius: 6px; padding: 8px; break-inside: avoid; }
      .label { color: #73827e; font-size: 8px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; }
      .value { margin-top: 4px; line-height: 1.35; overflow-wrap: anywhere; }
      .tracking { margin: 0 0 7px; padding: 6px 8px; background: #f1f7f4; border-radius: 5px; break-inside: avoid; }
      table { width: 100%; border-collapse: collapse; margin-top: 6px; }
      th { padding: 5px 6px; background: #103c3a; color: white; text-align: left; }
      td { padding: 4px 6px; border-bottom: 1px solid #e4ece8; }
      .numeric { text-align: right; white-space: nowrap; }
      .bottom-grid { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(175px, .75fr); gap: 10px; align-items: start; margin-top: 8px; }
      .totals { width: 100%; margin: 0; }
      .totals td { padding: 5px 6px; border: 0; }
      .total td { border-top: 2px solid #17665b; color: #103c3a; font-size: 12px; font-weight: 800; }
      .payment { margin: 0; padding: 8px; background: #f1f7f4; border-left: 3px solid #17665b; border-radius: 0 5px 5px 0; break-inside: avoid; }
      .payment h2 { margin: 0 0 5px; color: #103c3a; font-size: 11px; }
      .payment-method { margin: 0 0 4px; }
      .payment-list { display: grid; grid-template-columns: 1fr 1fr; gap: 3px 8px; }
      .payment-item { min-width: 0; overflow-wrap: anywhere; line-height: 1.3; }
      .payment-item strong { color: #50635f; }
      .notes { margin-top: 7px; padding: 6px 8px; border: 1px solid #dce7df; border-radius: 5px; white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.35; break-inside: avoid; }
      footer { margin-top: 8px; padding-top: 5px; border-top: 1px solid #dce7df; color: #647773; font-size: 8px; text-align: center; line-height: 1.35; }
      @media print {
        html, body { width: 100%; height: auto; }
        .page, .grid, .bottom-grid, table, .payment, .notes, footer { break-inside: avoid; page-break-inside: avoid; }
      }
    </style>
  </head>
  <body>
    <main class="page">
      <header class="top">
        <div class="brand">
          <img class="logo" src="data:image/png;base64,${logoBase64}" alt="MKTransportation Group logo">
          <div>
            <h1>${escapeHtml(company.brand)}</h1>
            <div class="company">${escapeHtml(company.name)}<br>MC/MX/FF: ${escapeHtml(company.mcNumber)} | USDOT: ${escapeHtml(company.usdotNumber)}<br>${escapeHtml(company.physicalAddress)}<br>${escapeHtml(company.mailingAddress)}<br>${escapeHtml(company.website)} | ${escapeHtml(company.email)}</div>
          </div>
        </div>
        <div>
          <div class="invoice-heading">INVOICE</div>
          <div class="invoice-meta">
            <strong>${escapeHtml(invoice.invoiceNumber)}</strong><br>
            Invoice date: ${formatDate(invoice.invoiceDate)}<br>
            Due date: ${formatDate(invoice.dueDate)}
          </div>
        </div>
      </header>

      <section class="grid">
        <div class="card">
          <div class="label">Bill To</div>
          <div class="value">
            <strong>${escapeHtml(carrier.name || "Carrier")}</strong><br>
            ${escapeHtml(carrier.company || "")}<br>
            ${escapeHtml(carrier.email)}<br>
            ${carrier.phone ? `Phone: ${escapeHtml(carrier.phone)}<br>` : ""}
            MC / DOT: ${escapeHtml(carrier.mcDot || "Not provided")}
          </div>
        </div>
        <div class="card">
          <div class="label">Agreement</div>
          <div class="value">
            Agreement tracking ID: <strong>${escapeHtml(carrier.trackingId)}</strong><br>
            Agreement type: ${escapeHtml(carrier.agreementType || "Not specified")}<br>
            Carrier type: ${escapeHtml(carrier.carrierType || "Not specified")}<br>
            Dispatch company: ${escapeHtml(carrier.selectedDispatch || "Not specified")}
          </div>
        </div>
      </section>

      <div class="tracking"><strong>Payment method:</strong> ${escapeHtml(paymentMethod)}</div>
      <table>
        <thead><tr><th>Service Description</th><th class="numeric">Qty</th><th class="numeric">Rate</th><th class="numeric">Amount</th></tr></thead>
        <tbody>
          ${serviceRows}
          ${invoice.additionalCharges > 0 ? `<tr><td>Additional charges</td><td class="numeric">1</td><td class="numeric">${formatCurrency(invoice.additionalCharges)}</td><td class="numeric">${formatCurrency(invoice.additionalCharges)}</td></tr>` : ""}
        </tbody>
      </table>

      <section class="bottom-grid">
        <div class="payment">
          <h2>Payment Details</h2>
          <p class="payment-method"><strong>Payment method:</strong> ${escapeHtml(paymentMethod)}</p>
          <div class="payment-list">
            ${paymentFields
              .map(
                ([label, value]) => `
                  <div class="payment-item"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</div>`,
              )
              .join("")}
          </div>
        </div>
        <table class="totals">
          <tr><td>Subtotal</td><td class="numeric">${formatCurrency(invoice.subtotal)}</td></tr>
          ${invoice.discount > 0 ? `<tr><td>Discount</td><td class="numeric">-${formatCurrency(invoice.discount)}</td></tr>` : ""}
          ${invoice.taxAmount > 0 ? `<tr><td>Tax (${escapeHtml(invoice.taxRate)}%)</td><td class="numeric">${formatCurrency(invoice.taxAmount)}</td></tr>` : ""}
          <tr class="total"><td>Total Due</td><td class="numeric">${formatCurrency(invoice.total)}</td></tr>
        </table>
      </section>

      ${invoice.notes ? `<section class="notes"><strong>Notes</strong><br>${escapeHtml(invoice.notes)}</section>` : ""}
      <footer>
        Thank you for working with MKTransportation Group.<br>
        Please include invoice number ${escapeHtml(invoice.invoiceNumber)} with your payment.
      </footer>
    </main>
  </body>
  </html>`;
};
