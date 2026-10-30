// backend/email/sendAgreementEmail.js

const nodemailer = require("nodemailer");

async function sendAgreementEmail(userEmail, pdfPath, formData) {
  // Gmail SMTP configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

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
    from: `"MK Transportation" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    cc: "hassansubbeh2446@gmail.com",
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
            <strong>MK Transportation Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f5f6fa;padding:25px;text-align:center;font-size:13px;color:#666;">
          MK Transportation<br>
          MK Transportation LLC<br>
          contact@mktransportationllc.com<br>
          michael@mktransportationllc.com
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

  // Verify Gmail connection and send email
  await transporter.verify();
  const info = await transporter.sendMail(mailOptions);

  console.log("AGREEMENT EMAIL SENT:", info.messageId);

  return info;
}

module.exports = sendAgreementEmail;