const fs = require("fs");
const company = require("../companyDetails");
const createTransporter = require("./createTransporter");

// Escape user-submitted values before inserting them into HTML.
const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });

// Reusable branded email layout.
const emailLayout = (content) => `
  <div style="
    margin:0;
    padding:35px 12px;
    background-color:#F4F7F6;
    font-family:Arial,Helvetica,sans-serif;
    color:#263B39;
  ">
    <div style="
      max-width:650px;
      margin:0 auto;
      background-color:#ffffff;
      border:1px solid #E2EAE7;
      border-radius:12px;
      overflow:hidden;
    ">

      <!-- Brand Header -->
      <div style="
        background-color:#103C3A;
        padding:30px 24px;
        text-align:center;
        border-bottom:5px solid #D4A84F;
      ">
        <div style="
          font-size:23px;
          font-weight:bold;
          letter-spacing:1.2px;
          color:#ffffff;
        ">
          MK Transportation
        </div>

        <div style="
          margin-top:7px;
          font-size:11px;
          letter-spacing:3px;
          color:#D4A84F;
          text-transform:uppercase;
        ">
          Reliable Logistics. Professional Service.
        </div>
      </div>

      <!-- Email Content -->
      <div style="padding:30px 26px;">
        ${content}
      </div>

      <!-- Footer -->
      <div style="
        background-color:#103C3A;
        padding:22px 20px;
        text-align:center;
      ">
        <div style="
          color:#ffffff;
          font-size:14px;
          font-weight:bold;
        ">
          ${company.name}
        </div>

        <div style="
          color:#D4A84F;
          font-size:12px;
          margin-top:7px;
        ">
          Your Trusted Logistics Partner
        </div>

        <div style="
          color:#D8E5E1;
          font-size:11px;
          margin-top:14px;
          line-height:1.7;
        ">
          MC/MX/FF: ${company.mcNumber} | USDOT: ${company.usdotNumber}<br>
          Physical: ${company.physicalAddress}<br>
          Mailing: ${company.mailingAddress}<br>
          ${company.email} | ${company.adminEmail}<br><br>
          This email was generated in connection with a carrier
          application submitted through our website.
        </div>
      </div>

    </div>
  </div>
`;

const detailRow = (label, value) => `
  <tr>
    <td style="
      width:40%;
      padding:12px;
      border:1px solid #E2EAE7;
      background-color:#F4F7F6;
      color:#103C3A;
      font-size:13px;
      font-weight:bold;
      vertical-align:top;
    ">
      ${escapeHtml(label)}
    </td>

    <td style="
      padding:12px;
      border:1px solid #E2EAE7;
      color:#344B47;
      font-size:13px;
      overflow-wrap:anywhere;
      vertical-align:top;
    ">
      ${escapeHtml(value || "Not provided")}
    </td>
  </tr>
`;

const sendCarrierFormEmail = async (carrierFormData, pdfPath) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.EMAIL_FROM) {
      throw new Error("SMTP email credentials are missing from the .env file.");
    }

    if (!carrierFormData?.email) {
      throw new Error("Applicant email address is missing.");
    }

    if (!pdfPath || !fs.existsSync(pdfPath)) {
      throw new Error("Carrier application PDF file was not found.");
    }

    const transporter = createTransporter();
    const firstName = escapeHtml(carrierFormData.firstName || "Applicant");
    const lastName = escapeHtml(carrierFormData.lastName || "");
    const businessName = escapeHtml(
      carrierFormData.businessLegalName || "New Application"
    );

    const applicantName =
      `${carrierFormData.firstName || ""} ${carrierFormData.lastName || ""}`
        .trim() || "Not provided";

    /*
    ========================================
    1. COMPANY EMAIL
    ========================================
    */

    const companyEmail = company.email;

    const companyHtml = emailLayout(`
      <div style="
        display:inline-block;
        padding:7px 12px;
        background-color:#EAF4F0;
        color:#17665B;
        border-radius:5px;
        font-size:11px;
        font-weight:bold;
        letter-spacing:1px;
        text-transform:uppercase;
      ">
        New Application
      </div>

      <h2 style="
        margin:18px 0 10px;
        color:#103C3A;
        font-size:25px;
      ">
        Carrier Application Received
      </h2>

      <p style="
        color:#60736E;
        font-size:14px;
        line-height:1.8;
      ">
        A new carrier application has been submitted through the
        MK Transportation website. The applicant's information
        is summarized below.
      </p>

      <div style="
        margin-top:25px;
        padding:15px;
        background-color:#103C3A;
        border-left:4px solid #D4A84F;
        border-radius:5px;
      ">
        <div style="
          color:#D4A84F;
          font-size:11px;
          text-transform:uppercase;
          letter-spacing:1px;
        ">
          Business Legal Name
        </div>

        <div style="
          color:#ffffff;
          font-size:17px;
          font-weight:bold;
          margin-top:6px;
          overflow-wrap:anywhere;
        ">
          ${businessName}
        </div>
      </div>

      <h3 style="
        margin:28px 0 12px;
        color:#103C3A;
        font-size:16px;
      ">
        Application Details
      </h3>

      <table style="
        width:100%;
        border-collapse:collapse;
        table-layout:fixed;
      ">
        ${detailRow("Applicant Name", applicantName)}
        ${detailRow("Phone Number", carrierFormData.phoneNumber)}
        ${detailRow("Email Address", carrierFormData.email)}
        ${detailRow("Carrier Mobile", carrierFormData.carrierMobile)}
        ${detailRow("Equipment Type", carrierFormData.equipmentType)}
        ${detailRow("ZIP Code", carrierFormData.zipCode)}
      </table>

      <div style="
        margin-top:25px;
        padding:17px;
        background-color:#FBF7EC;
        border:1px solid #E9D9AD;
        border-radius:6px;
      ">
        <div style="
          color:#103C3A;
          font-size:14px;
          font-weight:bold;
        ">
          PDF Application Attached
        </div>

        <p style="
          margin:7px 0 0;
          color:#68736D;
          font-size:13px;
          line-height:1.7;
        ">
          The complete carrier application is attached to this email
          for review and recordkeeping.
        </p>
      </div>

      <p style="
        margin-top:25px;
        color:#60736E;
        font-size:13px;
        line-height:1.8;
      ">
        Please review the application and follow up with the applicant
        as appropriate.
      </p>
    `);

    await transporter.sendMail({
      from: `"${company.name}" <${process.env.EMAIL_FROM}>`,
      to: companyEmail,
      replyTo: carrierFormData.email,
      subject: `New Carrier Application - ${
        carrierFormData.businessLegalName || "Applicant"
      }`,
      html: companyHtml,
      attachments: [
        {
          filename: "Carrier_Application.pdf",
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    });

    /*
    ========================================
    2. APPLICANT CONFIRMATION EMAIL
    ========================================
    */

    const applicantHtml = emailLayout(`
      <div style="
        text-align:center;
        padding:8px 0 18px;
      ">
        <div style="
          width:58px;
          height:58px;
          margin:0 auto 17px;
          background-color:#EAF4F0;
          border:2px solid #D4A84F;
          border-radius:50%;
          line-height:58px;
          color:#17665B;
          font-size:27px;
          font-weight:bold;
        ">
          &#10003;
        </div>

        <div style="
          color:#17665B;
          font-size:11px;
          font-weight:bold;
          letter-spacing:2px;
          text-transform:uppercase;
        ">
          Submission Confirmed
        </div>

        <h2 style="
          margin:12px 0 0;
          color:#103C3A;
          font-size:27px;
        ">
          Thank You, ${firstName}!
        </h2>
      </div>

      <p style="
        color:#526762;
        font-size:15px;
        line-height:1.9;
      ">
        Thank you for submitting your carrier application to
        <strong style="color:#103C3A;">
          ${company.name}
        </strong>.
        We appreciate your interest in working with us.
      </p>

      <div style="
        margin:24px 0;
        padding:20px;
        background-color:#F4F7F6;
        border-left:4px solid #D4A84F;
        border-radius:5px;
      ">
        <div style="
          color:#103C3A;
          font-size:15px;
          font-weight:bold;
        ">
          What happens next?
        </div>

        <p style="
          margin:9px 0 0;
          color:#60736E;
          font-size:13px;
          line-height:1.8;
        ">
          Our team has received your application. We will review
          the information provided and contact you if further
          information or follow-up is needed.
        </p>
      </div>

      <p style="
        color:#526762;
        font-size:14px;
        line-height:1.8;
      ">
        Please keep this email for your records. If you need to
        contact our team, you can reply to this email.
      </p>

      <div style="
        margin-top:28px;
        padding-top:20px;
        border-top:1px solid #E2EAE7;
      ">
        <p style="
          margin:0;
          color:#526762;
          font-size:14px;
          line-height:1.8;
        ">
          Best regards,<br/>

          <strong style="
            color:#103C3A;
            font-size:15px;
          ">
            ${company.name}
          </strong>
          <br/>
          MC/MX/FF: ${company.mcNumber} | USDOT: ${company.usdotNumber}<br/>
          Physical: ${company.physicalAddress}<br/>
          Mailing: ${company.mailingAddress}<br/>
          ${company.email}
        </p>
      </div>
    `);

    await transporter.sendMail({
      from: `"${company.name}" <${process.env.EMAIL_FROM}>`,
      to: carrierFormData.email,
      replyTo:
        process.env.CONTACT_EMAIL || "contact@mktransportationgroup.com",
      subject: `Carrier Application Received | ${company.name}`,
      html: applicantHtml,
    });

    console.log("======================================");
    console.log("Carrier Form Emails Sent Successfully");
    console.log("======================================");

    return true;
  } catch (error) {
    console.error("Carrier Form Email Error:", error);
    throw error;
  }
};

module.exports = sendCarrierFormEmail;