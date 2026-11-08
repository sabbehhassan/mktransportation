// backend/email/sendAgreementEmail.js

const company = require("../companyDetails");
const createTransporter = require("./createTransporter");

async function sendAgreementEmail(userEmail, pdfPath, formData) {
  const transporter = createTransporter();

  // Escape dynamic values before inserting them into HTML
  const escapeHtml = (value) =>
    String(value ?? "N/A").replace(/[&<>"']/g, (char) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[char];
    });

  const submittedName = String(
    formData.carrierName || formData.printName || "Carrier",
  )
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, 160);
  const from = {
    name: `${submittedName} via ${company.brand}`,
    address: process.env.EMAIL_FROM,
  };
  const carrierName = escapeHtml(formData.carrierName);
  const companyName = escapeHtml(formData.companyName);
  const mcDot = escapeHtml(formData.mcDot);
  const paymentMethod = escapeHtml(formData.paymentMethod);
  const printName = escapeHtml(formData.printName || "Carrier");
  const signature = escapeHtml(formData.signature);
  const trackingId = escapeHtml(
    formData.trackingId || "Please contact our team for your reference ID"
  );
  const submittedDate = escapeHtml(new Date().toLocaleString("en-US"));

  const mailOptions = {
    from,
    to: userEmail,
    replyTo: userEmail,
    subject: "Your Carrier Agreement Has Been Submitted Successfully",

    html: `
    <div style="background:#f4f6fa;padding:40px 0;font-family:Arial,sans-serif;">
      <div style="max-width:700px;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 35px rgba(0,0,0,0.08);">

        <!-- Header -->
        <div style="background:#0b1f5f;padding:45px 30px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:30px;">
            MK Transportation
          </h1>

          <p style="color:#dbe4ff;font-size:15px;margin-top:12px;">
            Your Carrier Agreement Has Been Received
          </p>
        </div>

        <!-- Body -->
        <div style="padding:35px;">

          <p style="font-size:16px;color:#333;line-height:1.8;">
            Dear <strong>${printName}</strong>,
          </p>

          <p style="font-size:15px;color:#555;line-height:1.9;">
            Thank you for choosing <strong>MK Transportation</strong>.
            Your agreement has been successfully received and is currently
            under review.
          </p>

          <!-- Reference Box -->
          <div style="background:#f2f7ff;border-radius:12px;padding:20px;margin:30px 0;">
            <p style="margin:0;font-size:15px;color:#333;">
              <strong>Tracking ID:</strong> ${trackingId}
            </p>

            <p style="margin-top:10px;font-size:15px;color:#333;">
              <strong>Submitted:</strong> ${submittedDate}
            </p>
          </div>

          <!-- Summary -->
          <h2 style="font-size:24px;color:#0b1f5f;margin-bottom:20px;">
            Agreement Summary
          </h2>

          <table style="width:100%;border-collapse:collapse;margin-bottom:30px;">
            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;">
                Carrier Name
              </td>
              <td style="padding:12px;border-bottom:1px solid #eee;color:#555;">
                ${carrierName}
              </td>
            </tr>

            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;">
                Company Name
              </td>
              <td style="padding:12px;border-bottom:1px solid #eee;color:#555;">
                ${companyName}
              </td>
            </tr>

            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;">
                USDOT / MC
              </td>
              <td style="padding:12px;border-bottom:1px solid #eee;color:#555;">
                ${mcDot}
              </td>
            </tr>

            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;">
                Payment Method
              </td>
              <td style="padding:12px;border-bottom:1px solid #eee;color:#555;">
                ${paymentMethod}
              </td>
            </tr>

            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;">
                Signed By
              </td>
              <td style="padding:12px;border-bottom:1px solid #eee;color:#555;">
                ${signature}
              </td>
            </tr>
          </table>

          <!-- Next Steps -->
          <div style="background:#eef6ff;border-radius:12px;padding:25px;margin-bottom:30px;">
            <h3 style="margin-top:0;color:#0b1f5f;">
              Next Steps
            </h3>

            <ol style="line-height:2;color:#555;padding-left:20px;">
              <li>Agreement verification</li>
              <li>Dispatch onboarding review</li>
              <li>Carrier setup processing</li>
              <li>Onboarding details will be shared with you</li>
            </ol>
          </div>

          <!-- PDF Notice -->
          <div style="background:#f8fafc;border-left:4px solid #0b1f5f;padding:18px;border-radius:8px;margin-bottom:25px;">
            <strong>Your carrier agreement PDF is attached to this email.</strong>
          </div>

          <p style="font-size:15px;color:#555;line-height:1.8;">
            Please keep your Tracking ID for future reference.
            If you have any questions, simply reply to this email.
          </p>

          <p style="font-size:15px;color:#555;margin-top:30px;">
            Best Regards,<br>
            <strong>${company.name}</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f5f6fa;padding:25px;text-align:center;font-size:13px;color:#666;">
          ${company.name}<br>
          MC/MX/FF: ${company.mcNumber} | USDOT: ${company.usdotNumber}<br>
          Physical: ${company.physicalAddress}<br>
          Mailing: ${company.mailingAddress}<br>
          ${company.email}<br>
          ${company.adminEmail}
        </div>

      </div>
    </div>
    `,

    attachments: [
      {
        filename: "Carrier-Agreement.pdf",
        path: pdfPath,
        contentType: "application/pdf",
      },
    ],
  };

  const notificationRows = [
    ["Carrier", formData.carrierName],
    ["Carrier company", formData.companyName],
    ["Carrier email", userEmail],
    ["Phone", formData.phone],
    ["MC / DOT", formData.mcDot],
    ["Carrier type", formData.carrierType],
    ["Agreement type", formData.agreementType],
    ["Payment method", formData.paymentMethod],
    ["Services", Array.isArray(formData.selectedServices)
      ? formData.selectedServices.join(", ")
      : formData.selectedServices],
    ["Tracking ID", formData.trackingId],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `
        <tr>
          <th style="padding:12px 14px;border-bottom:1px solid #e8eeeb;text-align:left;color:#53645f;font-size:13px;font-weight:600">${escapeHtml(label)}</th>
          <td style="padding:12px 14px;border-bottom:1px solid #e8eeeb;color:#172f2a;font-size:13px">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const companyNotification = {
    from,
    to: company.email,
    replyTo: userEmail,
    subject: `New Carrier Agreement Received | ${formData.carrierName || "Carrier"}`,
    text: [
      "A new carrier agreement was submitted through the website.",
      "",
      `Carrier: ${formData.carrierName || "Not provided"}`,
      `Company: ${formData.companyName || "Not provided"}`,
      `Email: ${userEmail}`,
      `Phone: ${formData.phone || "Not provided"}`,
      `MC / DOT: ${formData.mcDot || "Not provided"}`,
      `Agreement type: ${formData.agreementType || "Not provided"}`,
      `Tracking ID: ${formData.trackingId || "Not provided"}`,
      "",
      "The signed carrier agreement PDF is attached.",
    ].join("\n"),
    html: `
      <div style="margin:0;padding:36px 12px;background:#f2f5f4;font-family:Arial,Helvetica,sans-serif;color:#173b35">
        <div style="max-width:680px;margin:0 auto;overflow:hidden;border:1px solid #dfe8e4;border-radius:14px;background:#fff">
          <div style="padding:28px 32px;background:#123f39;color:#fff">
            <div style="color:#e2b957;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${escapeHtml(company.brand)}</div>
            <h1 style="margin:12px 0 6px;font-size:24px">New Carrier Agreement</h1>
            <p style="margin:0;color:#dce8e3;font-size:14px">A new agreement has been submitted for review.</p>
          </div>
          <div style="padding:28px 32px">
            <p style="margin:0 0 18px;color:#425650;font-size:14px;line-height:1.6">The signed agreement is attached. Use the tracking ID below to locate this submission in the admin panel.</p>
            <div style="margin-bottom:18px;padding:14px 16px;border:1px solid #e5ece8;border-radius:8px;background:#f7faf8">
              <div style="color:#75847f;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Tracking ID</div>
              <div style="margin-top:5px;color:#123f39;font-size:16px;font-weight:700">${escapeHtml(formData.trackingId || "Not provided")}</div>
            </div>
            <table role="presentation" style="width:100%;border-collapse:collapse">${notificationRows}</table>
            <p style="margin:22px 0 0;color:#75847f;font-size:12px;line-height:1.6">This is an automated notification sent to ${escapeHtml(company.email)}.</p>
          </div>
        </div>
      </div>`,
    attachments: [
      {
        filename: "Carrier-Agreement.pdf",
        path: pdfPath,
        contentType: "application/pdf",
      },
    ],
  };

  // Verify SMTP connection before sending the carrier confirmation and company notification.
  await transporter.verify();
  const companyInfo = await transporter.sendMail(companyNotification);
  const carrierInfo = await transporter.sendMail(mailOptions);

  for (const [label, info, recipient] of [
    ["company notification", companyInfo, company.email],
    ["carrier confirmation", carrierInfo, userEmail],
  ]) {
    const acceptedRecipients = Array.isArray(info.accepted)
      ? info.accepted.map((address) => String(address).trim().toLowerCase())
      : [];
    console.info("AGREEMENT EMAIL DELIVERY RESULT:", {
      type: label,
      to: recipient,
      accepted: info.accepted || [],
      rejected: info.rejected || [],
      response: info.response || "",
      messageId: info.messageId || "",
    });
    if (!acceptedRecipients.includes(recipient.trim().toLowerCase())) {
      throw new Error(`The mail server did not accept the ${label} recipient.`);
    }
  }

  return { companyInfo, carrierInfo };
}

module.exports = sendAgreementEmail;