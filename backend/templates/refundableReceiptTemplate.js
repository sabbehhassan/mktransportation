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

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);

module.exports = (receipt) => {
  const carrier = receipt.carrier || {};
  const company = receipt.company || {};
  const payment = receipt.payment || {};
  const authorization = receipt.authorization || {};
  const policy = String(receipt.refundPolicy || "")
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");

  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <style>
      @page { size: Letter portrait; margin: 0.45in; }
      * { box-sizing: border-box; }
      body { margin: 0; color: #233b38; font: 10px Arial, sans-serif; }
      .sheet { border: 1px solid #d9e5df; border-radius: 12px; overflow: hidden; }
      .header { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 20px 24px; background: #103c3a; color: #fff; }
      .brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
      .logo { max-width: 90px; max-height: 58px; object-fit: contain; background: #fff; border-radius: 6px; padding: 4px; }
      .company-name { font-size: 19px; font-weight: 800; }
      .company-info { margin-top: 5px; color: #dbe8e2; line-height: 1.5; }
      .receipt-label { color: #f0d99b; font-size: 17px; font-weight: 800; text-align: right; white-space: nowrap; }
      .receipt-number { margin-top: 6px; color: #fff; text-align: right; font-weight: 700; }
      .body { padding: 20px 24px 18px; }
      .status { display: inline-block; margin-bottom: 14px; padding: 6px 10px; border-radius: 99px; background: #e8f5ed; color: #17665b; font-size: 9px; font-weight: 800; letter-spacing: .5px; }
      .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 13px; }
      .meta-card, .section { border: 1px solid #dce7df; border-radius: 7px; padding: 10px 12px; }
      .label { color: #71817b; font-size: 8px; font-weight: 700; letter-spacing: .7px; text-transform: uppercase; }
      .value { margin-top: 4px; line-height: 1.5; overflow-wrap: anywhere; }
      .columns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
      h2 { margin: 0 0 8px; color: #103c3a; font-size: 11px; }
      .payment-total { margin: 5px 0 8px; color: #17665b; font-size: 22px; font-weight: 800; }
      .payment-table { width: 100%; border-collapse: collapse; }
      .payment-table td { padding: 4px 0; border-top: 1px solid #edf1ee; vertical-align: top; }
      .payment-table td:first-child { width: 42%; color: #71817b; }
      .policy { margin-top: 10px; }
      .policy-copy { line-height: 1.5; }
      .policy-copy p { margin: 0 0 6px; }
      .authorization { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #dce7df; }
      .signature-box { display: flex; flex-direction: column; justify-content: flex-end; min-height: 82px; }
      .signature { max-width: 190px; max-height: 56px; object-fit: contain; object-position: left bottom; margin-bottom: 4px; }
      .signature-placeholder { height: 45px; display: flex; align-items: center; color: #86948f; font-style: italic; }
      .signature-line { border-top: 1px solid #84928d; padding-top: 5px; color: #71817b; font-size: 8px; }
      .authorized { line-height: 1.6; }
      .footer { padding: 10px 24px; background: #f3f7f4; color: #61736e; text-align: center; font-size: 8px; line-height: 1.45; }
    </style>
  </head>
  <body>
    <main class="sheet">
      <header class="header">
        <div class="brand">
          ${company.logoDataUrl ? `<img class="logo" src="${escapeHtml(company.logoDataUrl)}" alt="Company logo">` : ""}
          <div>
            <div class="company-name">${escapeHtml(company.companyBrand || company.companyName)}</div>
            <div class="company-info">
              ${escapeHtml(company.companyName)}<br>
              ${company.companyPhone ? `${escapeHtml(company.companyPhone)}<br>` : ""}
              ${escapeHtml(company.companyEmail)}<br>
              ${escapeHtml(company.physicalAddress || company.mailingAddress)}<br>
              ${company.mcNumber ? `MC/MX/FF: ${escapeHtml(company.mcNumber)} · ` : ""}${company.usdotNumber ? `USDOT: ${escapeHtml(company.usdotNumber)}<br>` : ""}
              ${escapeHtml(company.companyWebsite)}
            </div>
          </div>
        </div>
        <div>
          <div class="receipt-label">REFUNDABLE<br>DEPOSIT RECEIPT</div>
          <div class="receipt-number">${escapeHtml(receipt.receiptNumber)}</div>
        </div>
      </header>
      <section class="body">
        <div class="status">PAYMENT STATUS: RECEIVED &amp; VERIFIED</div>
        <div class="meta">
          <div class="meta-card"><div class="label">Date Issued</div><div class="value">${formatDate(receipt.issuedDate)}</div></div>
          <div class="meta-card"><div class="label">Invoice Number</div><div class="value">${escapeHtml(receipt.invoiceNumber)}</div></div>
          <div class="meta-card"><div class="label">Agreement Tracking ID</div><div class="value">${escapeHtml(receipt.trackingId)}</div></div>
        </div>
        <div class="columns">
          <section class="section">
            <h2>Carrier Information</h2>
            <div class="value"><strong>${escapeHtml(carrier.name || "Carrier")}</strong><br>
              ${carrier.company ? `${escapeHtml(carrier.company)}<br>` : ""}
              ${escapeHtml(carrier.email)}<br>
              ${carrier.phone ? `${escapeHtml(carrier.phone)}<br>` : ""}
              MC / DOT: ${escapeHtml(carrier.mcDot || "Not provided")}
            </div>
          </section>
          <section class="section">
            <h2>Verified Payment</h2>
            <div class="label">Amount Received</div>
            <div class="payment-total">${formatCurrency(payment.amountReceived)}</div>
            <table class="payment-table">
              <tr><td>Payment method</td><td><strong>${escapeHtml(payment.method)}</strong></td></tr>
              <tr><td>Payment date</td><td>${formatDate(payment.date)}</td></tr>
              ${payment.reference ? `<tr><td>Payment reference</td><td>${escapeHtml(payment.reference)}</td></tr>` : ""}
            </table>
          </section>
        </div>
        <section class="section policy">
          <h2>Refund Policy</h2>
          <div class="policy-copy">${policy}</div>
        </section>
        <section class="authorization">
          <div class="authorized">
            <div class="label">Authorized By</div>
            <strong>${escapeHtml(authorization.name || "Authorized representative not configured")}</strong><br>
            ${escapeHtml(authorization.position || "Position not configured")}<br>
            ${escapeHtml(company.companyName)}
          </div>
          <div class="signature-box">
            ${authorization.signatureDataUrl
              ? `<img class="signature" src="${escapeHtml(authorization.signatureDataUrl)}" alt="Authorized signature">`
              : '<div class="signature-placeholder">Approved signature not configured</div>'}
            <div class="signature-line">Authorized signature</div>
          </div>
        </section>
      </section>
      <footer class="footer">
        This receipt confirms a payment recorded as received and manually verified by MKTransportation Group. Retain this document for your records.<br>
        ${escapeHtml(company.companyEmail)}${company.companyPhone ? ` · ${escapeHtml(company.companyPhone)}` : ""}
      </footer>
    </main>
  </body>
  </html>`;
};
