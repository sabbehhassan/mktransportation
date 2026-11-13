const fs = require("fs");
const path = require("path");
const company = require("../companyDetails");

const logoBase64 = fs.readFileSync(
  path.join(__dirname, "../public/logo.png"),
  "base64",
);
const certificateBase64 = fs.readFileSync(
  path.join(__dirname, "../public/certificate.png"),
  "base64",
);

const logoPath = `data:image/png;base64,${logoBase64}`;
const certificatePath = `data:image/png;base64,${certificateBase64}`;

const escapeHtml = (value) =>
  String(value ?? "N/A").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

const detailRow = (label, value) => `
  <tr>
    <th scope="row">${escapeHtml(label)}</th>
    <td>${escapeHtml(value || "N/A")}</td>
  </tr>`;

module.exports = function agreementTemplate(formData) {
  const agreementDate =
    formData.agreementDate ||
    formData.date ||
    new Date().toLocaleDateString("en-CA");
  const carrierType = String(formData.carrierType || "").toLowerCase();
  const carrierTypeLabel =
    carrierType === "new"
      ? "New Carrier"
      : carrierType === "old"
        ? "Old Carrier"
        : "N/A";

  const selectedServices = Array.isArray(formData.selectedServices)
    ? formData.selectedServices
    : formData.selectedServices
      ? [formData.selectedServices]
      : [];
  const serviceRows = selectedServices.length
    ? selectedServices
        .map((service) => {
          const description = String(service);
          const isWaivedOnboarding =
            carrierType === "old" &&
            description ===
              "Dedicated Lane Setup - $425 (Refundable after first delivery)";
          const match = description.match(
            /^(.*?)\s-\s\$(\d+(?:\.\d{1,2})?)(?:\s\((.*?)\))?$/,
          );
          const name = isWaivedOnboarding
            ? "ONBOARDING LANE SETUP FEE"
            : match
              ? match[1]
              : description;
          const amount = isWaivedOnboarding
            ? "No fee"
            : match
              ? `$${match[2]}`
              : "As stated";
          const refundability = isWaivedOnboarding
            ? "No onboarding fee applies to this carrier category"
            : match?.[3] || "Not specified";

          return `
            <tr>
              <td>${escapeHtml(name)}</td>
              <td class="amount">${escapeHtml(amount)}</td>
              <td>${escapeHtml(refundability)}</td>
            </tr>`;
        })
        .join("")
    : `<tr><td colspan="3" class="empty-state">No services selected.</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Trucking Service Agreement</title>
  <style>
    :root {
      --brand-black: #08090B;
      --brand-white: #FFFFFF;
      --brand-gold: #FFB800;
      --brand-gold-dark: #E5A000;
      --brand-dark-gray: #17191D;
      --brand-light-gray: #F3F4F6;
      --brand-border: #D8DADD;
      --body-text: #34363A;
    }

    * {
      box-sizing: border-box;
    }

    @page {
      size: Letter;
      margin: 0.72in 0.62in 0.7in;
    }

    html {
      color: var(--body-text);
      background: var(--brand-white);
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      line-height: 1.36;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      margin: 0;
    }

    p {
      margin: 0 0 6pt;
    }

    .document-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20pt;
      padding: 0 0 10pt;
      border-bottom: 2pt solid var(--brand-gold);
    }

    .logo {
      display: block;
      width: 116pt;
      height: auto;
      object-fit: contain;
    }

    .company {
      text-align: right;
      line-height: 1.5;
    }

    .company-name {
      margin: 0 0 3pt;
      color: var(--brand-black);
      font-size: 15pt;
      font-weight: 800;
      letter-spacing: 0.15pt;
    }

    .company-meta {
      margin: 0;
      color: var(--body-text);
      font-size: 8pt;
    }

    .title {
      position: relative;
      margin: 12pt 0 9pt;
      padding: 0 0 8pt;
      border-bottom: 1pt solid var(--brand-border);
      text-align: center;
    }

    .title::after {
      position: absolute;
      bottom: -1pt;
      left: calc(50% - 27pt);
      width: 54pt;
      height: 2pt;
      background: var(--brand-gold);
      content: "";
    }

    h1 {
      margin: 0;
      color: var(--brand-black);
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: 0.65pt;
      line-height: 1.2;
    }

    .subtitle {
      margin-top: 4pt;
      color: #55585D;
      font-size: 9pt;
    }

    .agreement-summary {
      display: flex;
      justify-content: space-between;
      gap: 14pt;
      margin: 0 0 8pt;
      padding: 6pt 8pt;
      border: 0.7pt solid var(--brand-border);
      border-left: 3pt solid var(--brand-gold);
      background: var(--brand-light-gray);
      font-size: 8.5pt;
    }

    .agreement-summary strong {
      color: var(--brand-black);
    }

    .intro {
      margin: 0 0 8pt;
      line-height: 1.45;
    }

    .section {
      margin: 0 0 7pt;
    }

    .information-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 12pt;
      margin-bottom: 7pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .information-grid .section {
      margin: 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 7pt;
      margin: 0 0 4pt;
      padding: 0 0 3pt;
      border-bottom: 0.8pt solid var(--brand-gold);
      color: var(--brand-black);
      font-size: 10pt;
      font-weight: 800;
      letter-spacing: 0.25pt;
      text-transform: uppercase;
      break-after: avoid;
      page-break-after: avoid;
    }

    .section-title::before {
      width: 3pt;
      height: 12pt;
      flex: 0 0 3pt;
      border-radius: 1pt;
      background: var(--brand-gold);
      content: "";
    }

    .section p {
      margin: 0;
      line-height: 1.4;
    }

    .info-table,
    .services-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .info-table tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .info-table th,
    .info-table td,
    .services-table th,
    .services-table td {
      padding: 3pt 6pt;
      border-bottom: 0.6pt solid #E1E2E4;
      text-align: left;
      vertical-align: top;
      overflow-wrap: anywhere;
    }

    .info-table th {
      width: 37%;
      color: #56595E;
      font-size: 8pt;
      font-weight: 700;
    }

    .info-table td {
      color: var(--brand-dark-gray);
      font-size: 8.5pt;
      font-weight: 500;
    }

    .company-info {
      padding: 3pt 8pt;
      border: 0.7pt solid var(--brand-border);
      border-radius: 3pt;
    }

    .company-info .info-table th {
      width: 35%;
    }

    .services-table {
      font-size: 8.25pt;
    }

    .services-table thead {
      display: table-header-group;
    }

    .services-table th {
      color: var(--brand-black);
      background: var(--brand-light-gray);
      font-size: 7.5pt;
      font-weight: 800;
      letter-spacing: 0.3pt;
      text-transform: uppercase;
    }

    .services-table th:first-child {
      width: 39%;
    }

    .services-table th:nth-child(2) {
      width: 17%;
    }

    .services-table th:nth-child(3) {
      width: 44%;
    }

    .services-table tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .services-table .amount {
      color: var(--brand-dark-gray);
      font-weight: 700;
      white-space: nowrap;
    }

    .empty-state {
      color: #65686D;
      font-style: italic;
      text-align: center !important;
    }

    .legal-list {
      margin: 0;
      padding-left: 16pt;
    }

    .legal-list li {
      margin: 0 0 2pt;
      padding-left: 2pt;
    }

    .payment-method {
      margin: 0 0 5pt;
      padding: 5pt 7pt;
      border-left: 2.5pt solid var(--brand-gold);
      background: var(--brand-light-gray);
    }

    .payment-method strong {
      color: var(--brand-black);
    }

    .carrier-details-section {
      margin-top: 7pt;
      padding: 6pt;
      border: 0.8pt solid var(--brand-border);
      border-radius: 3pt;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .carrier-details-section .section-title {
      margin-bottom: 7pt;
    }

    .certificate-page {
      min-height: 9.45in;
      break-before: page;
      page-break-before: always;
    }

    .certificate-title {
      margin: 0 0 4pt;
      color: var(--brand-black);
      font-size: 17pt;
      font-weight: 800;
      letter-spacing: 0.5pt;
      text-align: center;
    }

    .certificate-subtitle {
      margin: 0 0 14pt;
      color: #62656A;
      font-size: 8.5pt;
      text-align: center;
    }

    .certificate-rule {
      height: 2pt;
      margin: 0 0 12pt;
      background: var(--brand-gold);
    }

    .certificate img {
      display: block;
      width: auto;
      max-width: 100%;
      height: auto;
      max-height: 8.45in;
      margin: 0 auto;
      object-fit: contain;
      object-position: center top;
    }
  </style>
</head>
<body>
  <header class="document-header">
    <img src="${logoPath}" class="logo" alt="${escapeHtml(company.brand)} logo" />
    <div class="company">
      <p class="company-name">${escapeHtml(company.brand)}</p>
      <p class="company-meta"><strong>MC/MX/FF:</strong> ${escapeHtml(company.mcNumber)} &nbsp;|&nbsp; <strong>USDOT:</strong> ${escapeHtml(company.usdotNumber)}</p>
      <p class="company-meta">${escapeHtml(company.physicalAddress)}</p>
      <p class="company-meta">${escapeHtml(company.email)} &nbsp;|&nbsp; ${escapeHtml(company.website)}</p>
    </div>
  </header>

  <main>
    <div class="title">
      <h1>TRUCKING SERVICE AGREEMENT</h1>
      <p class="subtitle">(Dedicated Lanes, Dispatch, Trailer Rental &amp; Setup Services)</p>
    </div>

    <div class="agreement-summary">
      <span><strong>Agreement Date:</strong> ${escapeHtml(agreementDate)}</span>
      <span><strong>Tracking ID:</strong> ${escapeHtml(formData.trackingId || "N/A")}</span>
    </div>

    <p class="intro">
      This Agreement is made and entered into on <strong>${escapeHtml(agreementDate)}</strong>
      by and between <strong>${escapeHtml(company.name)}</strong> (hereinafter referred to as
      the <strong>"Company"</strong>) and the Carrier identified below.
    </p>

    <div class="information-grid">
      <section class="section">
        <h2 class="section-title">Company Information</h2>
        <div class="company-info">
          <table class="info-table">
            <tbody>
              ${detailRow("Company Name", company.name)}
              ${detailRow("MC/MX/FF Number", company.mcNumber)}
              ${detailRow("USDOT Number", company.usdotNumber)}
              ${detailRow("Physical Address", company.physicalAddress)}
              ${detailRow("Mailing Address", company.mailingAddress)}
              ${detailRow("Email / Website", `${company.email} | ${company.website}`)}
            </tbody>
          </table>
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">Carrier Information</h2>
        <table class="info-table">
          <tbody>
            ${detailRow("Carrier Name", formData.carrierName)}
            ${detailRow("Company Name", formData.companyName)}
            ${detailRow("MC / DOT", formData.mcDot)}
            ${detailRow("Driver Name", formData.driverName)}
            ${detailRow("Driver Phone", formData.driverPhone)}
            ${detailRow("License Number", formData.licenseNumber)}
            ${detailRow("Phone Number", formData.phone)}
            ${detailRow("Carrier Type", carrierTypeLabel)}
            ${detailRow("Agreement Date", agreementDate)}
          </tbody>
        </table>
      </section>
    </div>

    <section class="section">
      <h2 class="section-title">Selected Services</h2>
      <table class="services-table">
        <thead>
          <tr>
            <th scope="col">Service Name</th>
            <th scope="col">Amount</th>
            <th scope="col">Refundability / Terms</th>
          </tr>
        </thead>
        <tbody>
          ${serviceRows}
        </tbody>
      </table>
    </section>

    <section class="section">
      <h2 class="section-title">Payment Terms</h2>
      <p class="payment-method"><strong>Selected Option:</strong> ${escapeHtml(formData.paymentTermsMethod || "N/A")}</p>
    </section>

    <section class="section">
      <h2 class="section-title">Client Responsibilities</h2>
      <ul class="legal-list">
        <li>Provide accurate information.</li>
        <li>Maintain insurance &amp; authority.</li>
        <li>Professional communication.</li>
        <li>No fraud or chargebacks.</li>
      </ul>
    </section>

    <section class="section">
      <h2 class="section-title">Limitation of Liability</h2>
      <p>
        The BROKER shall not be liable for delays, freight market fluctuations,
        weather conditions, shipper delays, receiver delays or any events beyond
        the reasonable control of the BROKER.
      </p>
    </section>

    <section class="section">
      <h2 class="section-title">Payment Information</h2>
      <table class="info-table">
        <tbody>
          ${detailRow("Method", formData.paymentMethod || "2% for Quick Pay (Same Day)")}
          ${detailRow("Bank", formData.bankName)}
          ${detailRow("Account", formData.accountNumber)}
          ${detailRow("Routing", formData.routingNumber)}
        </tbody>
      </table>
    </section>

    <section class="section">
      <h2 class="section-title">Terms</h2>
      <p>
        The term of this Agreement shall be 120 days, commencing on the date listed above.
        If not cancelled by one of the Parties, the Agreement shall automatically renew
        itself for consecutive one-year terms. This Agreement cannot, by law, exempt the
        CARRIER / BROKER from any regulatory sanctions in the event that discrepancies
        are discovered during a physical examination of cargo or the review of documents
        associated with the carrier's Customs transactions. Nothing in the Agreement
        relieves CARRIER / BROKER of any responsibilities with respect to Canadian and
        United States law, including Customs Regulations.
      </p>
    </section>

    <section class="section">
      <h2 class="section-title">Entire Contract</h2>
      <p>
        This CARRIER SETUP / AGREEMENT contains all the terms and conditions that fully
        represent the mutual understanding and CARRIER SETUP / AGREEMENT between the
        parties. It supersedes all prior CARRIER SETUP / AGREEMENT, whether verbal or
        written, and no other understandings - express or implied - exist between the
        parties, except as expressly stated in this document.
      </p>
    </section>

    <section class="section">
      <h2 class="section-title">Notices</h2>
      <p>
        If the Carrier intends to terminate the contract or change jobs, the Carrier must
        provide at least 15 days' prior notice before ending the contract.
      </p>
    </section>

    <section class="section">
      <h2 class="section-title">Broker Obligations</h2>
      <p>
        BROKER shall pay CARRIER for transportation services rendered in accordance with
        the rates agreed upon in each Load Confirmation issued under this Agreement.
        Any Load Confirmation issued by the BROKER shall supplement and amend this
        Agreement whenever its terms conflict with this Agreement. This Agreement and
        each Load Confirmation govern all assessorial services. CARRIER shall not invoice
        any accessorial charges unless approved in writing. Rates may be amended orally;
        however, they must be confirmed in writing within five (5) working days in order
        to remain binding upon both Parties. As a condition precedent to payment, CARRIER
        shall provide Proof of Delivery (POD) together with the freight invoice confirming
        final delivery. BROKER agrees to arrange transportation services in compliance
        with all applicable Federal, State and local laws governing freight brokerage
        operations. The Parties acknowledge that BROKER'S responsibility is limited
        solely to arranging transportation services and does not include possession of
        freight or control over the methods used to transport freight.
      </p>
    </section>

    <section class="carrier-details-section">
      <h2 class="section-title">Carrier Details</h2>
      <table class="info-table">
        <tbody>
          ${detailRow("Printed Name", formData.printName || formData.carrierName)}
          ${detailRow("Company Name", formData.companyName)}
          ${detailRow("Agreement Date", agreementDate)}
        </tbody>
      </table>
    </section>
  </main>

  <section class="certificate-page">
    <h2 class="certificate-title">FMCSA BROKER CERTIFICATE</h2>
    <p class="certificate-subtitle">Reference Document</p>
    <div class="certificate-rule"></div>
    <div class="certificate">
      <img src="${certificatePath}" alt="FMCSA Broker Certificate" />
    </div>
  </section>

</body>
</html>`;
};
