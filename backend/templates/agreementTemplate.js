const fs = require("fs");
const path = require("path");
const company = require("../companyDetails");

const logoBase64 = fs.readFileSync(
  path.join(__dirname, "../public/logo.png"),
  "base64"
);

const certificateBase64 = fs.readFileSync(
  path.join(__dirname, "../public/certificate.png"),
  "base64"
);

const logoPath = `data:image/png;base64,${logoBase64}`;
const certificatePath = `data:image/png;base64,${certificateBase64}`;

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

  const formattedServices = (formData.selectedServices || []).map((service) => {
    if (carrierType === "old") {
      if (
        service ===
        "Dedicated Lane Setup - $425 (Refundable after first delivery)"
      ) {
        return "ONBOARDING LANE SETUP FEE";
      }
      return service.split(" - $")[0];
    }
    return service;
  });

  return `

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Trucking Service Agreement</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{

    font-family: Cambria, Georgia, serif;
    color:#222;
    background:#fff;
    font-size:14px;
    line-height:1.7;

}

.page{

    width:100%;
    padding:45px 55px;

}

.page-break{

    page-break-before:always;

}

h1,h2,h3,h4,h5{

    margin:0;

}

p{

    margin:0 0 10px;

}

table{

    width:100%;
    border-collapse:collapse;

}

td{

    padding:6px 4px;
    vertical-align:top;

}

ul{

    margin:10px 0 12px 22px;

}

li{

    margin-bottom:7px;

}

.section{

    margin-top:30px;

}

.section-title{

    font-size:18px;
    font-weight:bold;
    color:#17665B;
    border-bottom:2px solid #17665B;
    padding-bottom:7px;
    margin-bottom:16px;
    text-transform:uppercase;
    letter-spacing:.5px;

}

.header{

    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    border-bottom:3px solid #17665B;
    padding-bottom:18px;
    margin-bottom:28px;

}

.logo{
    width:130px;
    height:auto;
}

.company{

    text-align:right;

}

.company h2{

    font-size:24px;
    color:#17665B;

}

.company p{

    font-size:13px;
    margin-top:3px;

}

.title{

    text-align:center;
    margin-bottom:28px;

}

.title h1{

    font-size:30px;
    color:#17665B;
    font-weight:bold;
    letter-spacing:.5px;

}

.subtitle{

    font-size:15px;
    color:#666;
    margin-top:5px;

}

.info-table{

    width:100%;

}

.info-table td{

    padding:7px 3px;

}

.label{

    width:220px;
    font-weight:bold;

}

.value{

    color:#222;

}

.notice{

    background:#F3F7F3;
    border-left:4px solid #17665B;
    padding:18px;
    margin-top:18px;

}

.notice p{

    margin:0;

}

.footer{

    position:fixed;
    left:55px;
    right:55px;
    bottom:15px;

    display:flex;
    justify-content:space-between;

    font-size:11px;
    color:#666;

}

.company-box{

    border:1px solid #D8D8D8;
    padding:18px;
    margin-bottom:22px;
    border-radius:4px;

}

.company-box table td{

    padding:5px 0;

}

.company-box .label{

    width:180px;

}

.info-box{

    border:1px solid #E2E2E2;
    margin-bottom:10px;
    padding:10px 12px;
    border-radius:4px;

}

.info-label{

    display:block;
    font-size:12px;
    color:#777;
    margin-bottom:3px;

}

.info-value{

    font-size:14px;
    font-weight:bold;
    color:#222;

}

.highlight{

    color:#17665B;
    font-weight:bold;

}

.small{

    font-size:13px;

}

.signature-line{

    border-top:1px solid #222;
    margin-top:45px;
    padding-top:6px;
    width:250px;

}

.certificate{
    width:100%;
    text-align:center;
    padding:0;
    margin-top:10px;
}

.certificate img{
    width:100%;
    max-height:640px;
    object-fit:contain;
}

</style>

</head>

    <body>



<div class="page">

    <!-- ========================= -->
    <!-- HEADER -->
    <!-- ========================= -->

    <div class="header">

        <div>

            <img src="${logoPath}" class="logo" alt="Logo" />

        </div>

        <div class="company">

            <h2>${company.brand}</h2>

            <p><strong>MC/MX/FF:</strong> ${company.mcNumber}</p>

            <p><strong>USDOT:</strong> ${company.usdotNumber}</p>

        </div>

    </div>


    <!-- ========================= -->
    <!-- AGREEMENT TITLE -->
    <!-- ========================= -->

    <div class="title">

        <h1>TRUCKING SERVICE AGREEMENT</h1>

        <div class="subtitle">
            (Dedicated Lanes, Dispatch, Trailer Rental &
            Setup Services)
        </div>

    </div>


    <!-- ========================= -->
    <!-- INTRODUCTION -->
    <!-- ========================= -->

    <p>

        This Agreement is made and entered into on

        <strong>${agreementDate}</strong>

        by and between
        <strong>${company.name}</strong>
        (hereinafter referred to as the
        <strong>"Company"</strong>)
        and the following Carrier.

    </p>


    <!-- ========================= -->
    <!-- COMPANY INFORMATION -->
    <!-- ========================= -->

    <div class="section">

        <div class="section-title">

            Company Information

        </div>

        <div class="company-box">

            <table>

                <tr>

                    <td class="label">

                        Company Name

                    </td>

                    <td class="value">

                        ${company.name}

                    </td>

                </tr>

                <tr>

                    <td class="label">

                        MC/MX/FF Number

                    </td>

                    <td class="value">

                        ${company.mcNumber}

                    </td>

                </tr>

                <tr>

                    <td class="label">

                        USDOT Number

                    </td>

                    <td class="value">

                        ${company.usdotNumber}

                    </td>

                </tr>

                <tr>

                    <td class="label">

                        Physical Address

                    </td>

                    <td class="value">

                        ${company.physicalAddress}

                    </td>

                </tr>

                <tr>

                    <td class="label">

                        Mailing Address

                    </td>

                    <td class="value">

                        ${company.mailingAddress}

                    </td>

                </tr>

                <tr>

                    <td class="label">

                        Email

                    </td>

                    <td class="value">

                        ${company.email}

                    </td>

                </tr>

            </table>

        </div>

    </div>


    <!-- ========================= -->
    <!-- CARRIER INFORMATION -->
    <!-- ========================= -->

    <div class="section">

        <div class="section-title">

            Carrier Information

        </div>

        <table class="info-table">

            <tr>

                <td class="label">

                    Carrier Name

                </td>

                <td class="value">

                    ${formData.carrierName || "N/A"}

                </td>

            </tr>

            <tr>

                <td class="label">

                    Company Name

                </td>

                <td class="value">

                    ${formData.companyName || "N/A"}

                </td>

            </tr>

            <tr>

                <td class="label">

                    MC / DOT

                </td>

                <td class="value">

                    ${formData.mcDot || "N/A"}

                </td>

            </tr>

            <tr>

                <td class="label">

                    Driver Name

                </td>

                <td class="value">

                    ${formData.driverName || "N/A"}

                </td>

            </tr>

            <tr>

                <td class="label">

                    Driver Phone

                </td>

                <td class="value">

                    ${formData.driverPhone || "N/A"}

                </td>

            </tr>

            <tr>

                <td class="label">

                    License Number

                </td>

                <td class="value">

                    ${formData.licenseNumber || "N/A"}

                </td>

            </tr>

            <tr>

                <td class="label">

                    Phone Number

                </td>

                <td class="value">

                    ${formData.phone || "N/A"}

                </td>

            </tr>

            <tr>

                <td class="label">

                    Carrier Type

                </td>

                <td class="value">

                    ${carrierTypeLabel}

                </td>

            </tr>

            <tr>

                <td class="label">

                    Agreement Date

                </td>

                <td class="value">

                    ${agreementDate}

                </td>

            </tr>

        </table>

    </div>

<div class="section">

    <div class="section-title">

        Load Pickup and Delivery Schedule

    </div>

    <ul>

        ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          .map(
            (day) => `
        <li>

            Pickup on ${day} between 7:00 AM and 10:00 AM. Delivery is
            available 24/7 with backhaul service.

        </li>
        `,
          )
          .join("")}

    </ul>

</div>

<div class="section">

    <div class="section-title">

        Carrier Setup Agreement and Security Practices

    </div>

    <p>

        This Carrier Setup Agreement between ${company.name} and the
        Carrier/Shipper is intended to support cooperation and strengthen
        cargo and equipment security throughout the transportation process.
        The Carrier/Shipper agrees to establish, maintain, and update a
        traceable, documented security program consistent with applicable
        guidelines. If the Carrier/Shipper does not oversee a manufacturing
        site, distribution point, or another part of the supply chain, it will
        encourage the responsible third parties to follow appropriate
        security practices.

    </p>

</div>


    <!-- ========================= -->
<!-- SELECTED SERVICES -->
<!-- ========================= -->

<div class="section">

    <div class="section-title">

        Selected Services

    </div>

    ${
      formattedServices.length
        ? `
    <ul>

        ${formattedServices
          .map(
            (service) => `
        <li>

            ${service}

        </li>
        `
          )
          .join("")}

    </ul>
    `
        : `
    <p>

        No services selected.

    </p>
    `
    }

</div>


<!-- ========================= -->
<!-- PAYMENT TERMS -->
<!-- ========================= -->

<div class="section">

    <div class="section-title">

        Payment Terms

    </div>

    <p>

        <strong>Selected Option :</strong>

        ${formData.paymentTermsMethod || "N/A"}

    </p>

</div>


<!-- ========================= -->
<!-- CLIENT RESPONSIBILITIES -->
<!-- ========================= -->

<div class="section">

    <div class="section-title">

        Client Responsibilities

    </div>

    <ul>

        <li>

            Provide accurate information.

        </li>

        <li>

            Maintain insurance & authority.

        </li>

        <li>

            Professional communication.

        </li>

        <li>

            No fraud or chargebacks.

        </li>

    </ul>

</div>

    <!-- ========================= -->
<!-- LIMITATION OF LIABILITY -->
<!-- ========================= -->

<div class="section">

    <div class="section-title">

        Limitation Of Liability

    </div>

    <p>

        The BROKER shall not be liable for delays,
        freight market fluctuations, weather conditions,
        shipper delays, receiver delays or any events
        beyond the reasonable control of the BROKER.

    </p>

</div>



<!-- ========================= -->
<!-- PAYMENT INFORMATION -->
<!-- ========================= -->

<div class="section">

    <div class="section-title">

        Payment Information

    </div>

    <table class="info-table">

        <tr>

            <td class="label">

                Method

            </td>

            <td class="value">

                ${formData.paymentMethod || "2% for Quick Pay (Same Day)"}

            </td>

        </tr>

        <tr>

            <td class="label">

                Bank

            </td>

            <td class="value">

                ${formData.bankName || "N/A"}

            </td>

        </tr>

        <tr>

            <td class="label">

                Account

            </td>

            <td class="value">

                ${formData.accountNumber || "N/A"}

            </td>

        </tr>

        <tr>

            <td class="label">

                Routing

            </td>

            <td class="value">

                ${formData.routingNumber || "N/A"}

            </td>

        </tr>

    </table>

</div>



<!-- ========================= -->
<!-- TERMS -->
<!-- ========================= -->

<div class="page-break"></div>

<div class="section">

    <div class="section-title">

        Terms

    </div>

    <p>

        The term of this Agreement shall be 120 days, commencing on the date listed above. If not
cancelled by one of the Parties, the Agreement shall automatically renew itself for consecutive
one-year terms.
This Agreement cannot, by law, exempt the CARRIER / BROKER from any regulatory sanctions in
the event that discrepancies are discovered during a physical examination of cargo or the review
of documents associated with the carrier's Customs transactions.
Nothing in the Agreement relieves CARRIER / BROKER of any responsibilities with respect to
Canadian and United States law, including Customs Regulations.


    </p>

</div>

<div class="section">

    <div class="section-title">

        Entire Contract

    </div>

    <p>

        This CARRIER SETUP / AGREEMENT contains all the terms and conditions
        that fully represent the mutual understanding and CARRIER SETUP /
        AGREEMENT between the parties. It supersedes all prior CARRIER SETUP /
        AGREEMENT, whether verbal or written, and no other understandings -
        express or implied - exist between the parties, except as expressly
        stated in this document.

    </p>

</div>

<div class="section">

    <div class="section-title">

        Notices

    </div>

    <p>

        If the Carrier intends to terminate the contract or change jobs, the
        Carrier must provide at least 15 days' prior notice before ending the
        contract.

    </p>

</div>


<!-- ========================= -->
<!-- BROKER OBLIGATIONS -->
<!-- ========================= -->

<div class="section">

    <div class="section-title">

        Broker Obligations

    </div>

    <p>

        BROKER shall pay CARRIER for transportation services
        rendered in accordance with the rates agreed upon in
        each Load Confirmation issued under this Agreement.

    </p>

    <p>

        Any Load Confirmation issued by the BROKER shall
        supplement and amend this Agreement whenever its
        terms conflict with this Agreement.

    </p>

    <p>

        This Agreement and each Load Confirmation govern
        all assessorial services. CARRIER shall not invoice
        any accessorial charges unless approved in writing.

    </p>

    <p>

        Rates may be amended orally; however, they must be
        confirmed in writing within five (5) working days in
        order to remain binding upon both Parties.

    </p>

    <p>

        As a condition precedent to payment, CARRIER shall
        provide Proof of Delivery (POD) together with the
        freight invoice confirming final delivery.

    </p>

    <p>

        BROKER agrees to arrange transportation services
        in compliance with all applicable Federal, State and
        local laws governing freight brokerage operations.

    </p>

    <p>

        The Parties acknowledge that BROKER'S responsibility
        is limited solely to arranging transportation services
        and does not include possession of freight or control
        over the methods used to transport freight.

    </p>

</div>

        <!-- ========================= -->
    <!-- CARRIER DETAILS -->
    <!-- ========================= -->

    <div class="section">

        <div class="section-title">

            Carrier Details

        </div>

        <table class="info-table">

            <tr>

                <td class="label">
                    Signature
                </td>

                <td class="value">

                    ${
                        formData.signature
                            ? `<img
                                   src="${formData.signature}"
                                   style="max-width:220px;max-height:80px;"
                               />`
                            : "____________________________"
                    }

                </td>

            </tr>

            <tr>

                <td class="label">

                    Print Name

                </td>

                <td class="value">

                    ${formData.printName || formData.carrierName || "N/A"}

                </td>

            </tr>

            <tr>

                <td class="label">

                    Company Name

                </td>

                <td class="value">

                    ${formData.companyName || "N/A"}

                </td>

            </tr>

            <tr>

                <td class="label">

                    Agreement Date

                </td>

                <td class="value">

                    ${agreementDate}

                </td>

            </tr>

        </table>

    </div>



<!-- ================================================= -->
<!-- PAGE 2 -->
<!-- ================================================= -->

<div class="page-break"></div>

<div class="page">

    <div class="title">

        <h1>

            FMCSA BROKER CERTIFICATE

        </h1>

        <div class="subtitle">

            Reference Document

        </div>

    </div>

    <div class="certificate">

        <img src="${certificatePath}" alt="Certificate" style="width:100%;" />

    </div>

</div>



<div class="footer">

    <span>

        Trucking Service Agreement

    </span>

    <span>

        Generated on ${agreementDate}

    </span>

</div>

</body>

</html>

`;
};