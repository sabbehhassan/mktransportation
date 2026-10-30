const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// ========================================
// GMAIL SMTP CONFIGURATION
// ========================================

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 465),
  secure: Number(process.env.EMAIL_PORT || 465) === 465,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========================================
// HTML SECURITY
// ========================================

const escapeHtml = (value = "") => {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
};

// ========================================
// CONTACT US API
// POST /api/contact
// ========================================

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    // Validate required fields
    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Validate field lengths
    if (
      name.length > 150 ||
      email.length > 254 ||
      phone.length > 50 ||
      message.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length.",
      });
    }

    // Check Gmail credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials are missing.");

      return res.status(500).json({
        success: false,
        message: "Email service is not configured yet.",
      });
    }

    // Recipient: your personal Gmail during local testing.
    // Later, change COMPANY_EMAIL to your company mailbox.
    const recipient =
      process.env.COMPANY_EMAIL || process.env.EMAIL_USER;

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = escapeHtml(phone.trim());

    const safeMessage = escapeHtml(message.trim()).replace(
      /\r\n|\r|\n/g,
      "<br>"
    );

    // ========================================
    // PREMIUM TEAL + GOLD EMAIL TEMPLATE
    // ========================================

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Inquiry</title>
      </head>

      <body style="
        margin:0;
        padding:0;
        background-color:#F4F7F6;
        font-family:Arial,Helvetica,sans-serif;
        color:#263B39;
      ">

        <div style="padding:30px 12px;">

          <div style="
            max-width:650px;
            margin:0 auto;
            background:#ffffff;
            border:1px solid #E2EAE7;
            border-radius:12px;
            overflow:hidden;
          ">

            <!-- HEADER -->
            <div style="
              background:#103C3A;
              padding:30px 20px;
              text-align:center;
              border-bottom:5px solid #D4A84F;
            ">

              <h1 style="
                margin:0;
                color:#ffffff;
                font-size:23px;
                letter-spacing:1px;
              ">
                MK Transportation
              </h1>

              <p style="
                margin:10px 0 0;
                color:#F0D99B;
                font-size:11px;
                letter-spacing:2px;
              ">
                RELIABLE LOGISTICS. PROFESSIONAL SERVICE.
              </p>

            </div>

            <!-- CONTENT -->
            <div style="padding:30px 24px;">

              <span style="
                display:inline-block;
                padding:8px 12px;
                background:#EAF4F0;
                color:#17665B;
                font-size:11px;
                font-weight:bold;
                letter-spacing:1px;
                border-radius:5px;
              ">
                NEW CONTACT INQUIRY
              </span>

              <h2 style="
                margin:20px 0 10px;
                color:#103C3A;
                font-size:25px;
              ">
                You Have a New Message!
              </h2>

              <p style="
                margin:0 0 25px;
                color:#647670;
                font-size:14px;
                line-height:1.8;
              ">
                Someone has submitted a new inquiry through the
                Contact Us form on your website.
                Here are the submitted details.
              </p>

              <!-- CONTACT DETAILS -->
              <table style="
                width:100%;
                border-collapse:collapse;
                table-layout:fixed;
              ">

                <tr>
                  <td style="
                    width:35%;
                    padding:13px;
                    background:#F4F7F6;
                    border:1px solid #E2EAE7;
                    color:#103C3A;
                    font-size:13px;
                    font-weight:bold;
                  ">
                    Full Name
                  </td>

                  <td style="
                    padding:13px;
                    border:1px solid #E2EAE7;
                    color:#344B47;
                    font-size:13px;
                    overflow-wrap:anywhere;
                  ">
                    ${safeName}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding:13px;
                    background:#F4F7F6;
                    border:1px solid #E2EAE7;
                    color:#103C3A;
                    font-size:13px;
                    font-weight:bold;
                  ">
                    Email Address
                  </td>

                  <td style="
                    padding:13px;
                    border:1px solid #E2EAE7;
                    color:#17665B;
                    font-size:13px;
                    overflow-wrap:anywhere;
                  ">
                    ${safeEmail}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding:13px;
                    background:#F4F7F6;
                    border:1px solid #E2EAE7;
                    color:#103C3A;
                    font-size:13px;
                    font-weight:bold;
                  ">
                    Phone Number
                  </td>

                  <td style="
                    padding:13px;
                    border:1px solid #E2EAE7;
                    color:#344B47;
                    font-size:13px;
                    overflow-wrap:anywhere;
                  ">
                    ${safePhone}
                  </td>
                </tr>

              </table>

              <!-- MESSAGE -->
              <div style="
                margin-top:25px;
                padding:20px;
                background:#FBF7EC;
                border:1px solid #E9D9AD;
                border-left:4px solid #D4A84F;
                border-radius:6px;
              ">

                <h3 style="
                  margin:0 0 12px;
                  color:#103C3A;
                  font-size:16px;
                ">
                  Message Details
                </h3>

                <div style="
                  color:#526762;
                  font-size:14px;
                  line-height:1.9;
                  overflow-wrap:anywhere;
                ">
                  ${safeMessage}
                </div>

              </div>

              <!-- REPLY BUTTON -->
              <div style="text-align:center;margin-top:30px;">

                <a
                  href="mailto:${encodeURIComponent(email.trim())}"
                  style="
                    display:inline-block;
                    padding:14px 25px;
                    background:#103C3A;
                    color:#ffffff;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:bold;
                    border-radius:7px;
                  "
                >
                  Reply to This Inquiry
                </a>

              </div>

              <p style="
                margin:25px 0 0;
                color:#7A8984;
                font-size:12px;
                line-height:1.7;
                text-align:center;
              ">
                This message was submitted through the
                MK Transportation website.
              </p>

            </div>

            <!-- FOOTER -->
            <div style="
              padding:22px;
              background:#103C3A;
              text-align:center;
            ">

              <p style="
                margin:0;
                color:#ffffff;
                font-size:14px;
                font-weight:bold;
              ">
                MK Transportation LLC
              </p>

              <p style="
                margin:8px 0 0;
                color:#D4A84F;
                font-size:12px;
              ">
                Your Trusted Logistics Partner
              </p>

            </div>

          </div>

        </div>

      </body>
      </html>
    `;

    // ========================================
    // SEND EMAIL
    // ========================================

    await transporter.sendMail({
      from: `"MK Transportation LLC" <${process.env.EMAIL_USER}>`,

      to: recipient,

      replyTo: email.trim(),

      subject: `New Contact Inquiry from ${name.trim()}`,

      text: `
New Contact Us Inquiry

Name: ${name.trim()}
Email: ${email.trim()}
Phone: ${phone.trim()}

Message:
${message.trim()}
      `,

      html: htmlTemplate,
    });

    console.log("Contact email sent successfully.");

    return res.status(200).json({
      success: true,
      message:
        "Your message has been sent successfully. Our team will contact you shortly.",
    });
  } catch (error) {
    console.error("Contact email error:", error);

    return res.status(500).json({
      success: false,
      message:
        "We couldn't send your message right now. Please try again later.",
    });
  }
});

module.exports = router;