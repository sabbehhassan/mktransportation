const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: Number(process.env.EMAIL_PORT || 465),
  secure: Number(process.env.EMAIL_PORT || 465) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    // Remove spaces from Gmail App Password
    pass: process.env.EMAIL_PASS?.replace(/\s/g, ""),
  },
});

router.post("/", async (req, res) => {
  try {
    console.log("CONTACT FORM REQUEST RECEIVED");

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
        message: "All fields are required.",
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

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email configuration is missing.");

      return res.status(500).json({
        success: false,
        message: "Email service is not configured correctly.",
      });
    }

    const recipient =
      process.env.COMPANY_EMAIL || process.env.EMAIL_USER;

    console.log("EMAIL_USER =>", process.env.EMAIL_USER);
    console.log("EMAIL_PASS =>", process.env.EMAIL_PASS ? "Loaded" : "Missing");
    console.log("SMTP =>", {
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT || 465),
      secure: Number(process.env.EMAIL_PORT || 465) === 465,
    });

    // Verify SMTP connection and authentication
    await transporter.verify();

    console.log("Gmail SMTP authentication successful.");

    // Escape user input before inserting it into HTML
    const escapeHtml = (value) =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safePhone = escapeHtml(phone.trim());
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br>");

    // Email content
// Premium MK Transportation Email Template
const mailOptions = {
  from: `"MK Transportation" <${process.env.EMAIL_USER}>`,
  to: recipient,
  replyTo: email.trim(),
  subject: `New Website Inquiry | ${name.trim()}`,

  text: `
MK Transportation
NEW WEBSITE INQUIRY

Name: ${name.trim()}
Email: ${email.trim()}
Phone: ${phone.trim()}

Message:
${message.trim()}

This inquiry was submitted through the MK Transportation website.
  `,

  html: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Website Inquiry</title>
  </head>

  <body style="
    margin: 0;
    padding: 0;
    background-color: #f1f4f2;
    font-family: Arial, Helvetica, sans-serif;
    color: #183b36;
  ">

    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background-color: #f1f4f2; padding: 32px 12px;"
    >
      <tr>
        <td align="center">

          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              max-width: 620px;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              border: 1px solid #e2e9e5;
            "
          >

            <!-- Gold Accent -->
            <tr>
              <td style="
                height: 5px;
                background-color: #d8ad4f;
                font-size: 0;
                line-height: 0;
              ">&nbsp;</td>
            </tr>

            <!-- Brand Header -->
            <tr>
              <td style="
                background-color: #123f39;
                padding: 34px 32px;
                text-align: center;
              ">

                <p style="
                  margin: 0;
                  color: #e2b957;
                  font-size: 11px;
                  font-weight: bold;
                  letter-spacing: 3px;
                  text-transform: uppercase;
                ">
                  MK Transportation
                </p>

                <h1 style="
                  margin: 18px 0 10px;
                  color: #ffffff;
                  font-size: 28px;
                  line-height: 1.3;
                  font-weight: 700;
                ">
                  New Website Inquiry
                </h1>

                <p style="
                  margin: 0;
                  color: #dce8e3;
                  font-size: 14px;
                  line-height: 1.7;
                ">
                  A new message has been submitted through your website.
                </p>

              </td>
            </tr>

            <!-- Gold Divider -->
            <tr>
              <td style="
                height: 3px;
                background-color: #d8ad4f;
                font-size: 0;
                line-height: 0;
              ">&nbsp;</td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding: 32px;">

                <p style="
                  margin: 0 0 8px;
                  color: #bd9140;
                  font-size: 11px;
                  font-weight: bold;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                ">
                  CONTACT DETAILS
                </p>

                <h2 style="
                  margin: 0 0 24px;
                  color: #183b36;
                  font-size: 21px;
                  line-height: 1.4;
                ">
                  Customer Information
                </h2>

                <!-- Name -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    margin-bottom: 12px;
                    background-color: #f6f8f6;
                    border: 1px solid #e5ebe7;
                    border-radius: 8px;
                  "
                >
                  <tr>
                    <td style="padding: 16px 18px;">
                      <p style="
                        margin: 0 0 6px;
                        color: #72817a;
                        font-size: 11px;
                        font-weight: bold;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                      ">
                        Full Name
                      </p>

                      <p style="
                        margin: 0;
                        color: #183b36;
                        font-size: 15px;
                        font-weight: bold;
                        line-height: 1.6;
                        word-break: break-word;
                      ">
                        ${safeName}
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Email -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    margin-bottom: 12px;
                    background-color: #f6f8f6;
                    border: 1px solid #e5ebe7;
                    border-radius: 8px;
                  "
                >
                  <tr>
                    <td style="padding: 16px 18px;">
                      <p style="
                        margin: 0 0 6px;
                        color: #72817a;
                        font-size: 11px;
                        font-weight: bold;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                      ">
                        Email Address
                      </p>

                      <p style="
                        margin: 0;
                        font-size: 15px;
                        line-height: 1.6;
                        word-break: break-word;
                      ">
                        <a
                          href="mailto:${safeEmail}"
                          style="
                            color: #176b5c;
                            text-decoration: none;
                            font-weight: bold;
                          "
                        >
                          ${safeEmail}
                        </a>
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Phone -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    margin-bottom: 28px;
                    background-color: #f6f8f6;
                    border: 1px solid #e5ebe7;
                    border-radius: 8px;
                  "
                >
                  <tr>
                    <td style="padding: 16px 18px;">
                      <p style="
                        margin: 0 0 6px;
                        color: #72817a;
                        font-size: 11px;
                        font-weight: bold;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                      ">
                        Phone Number
                      </p>

                      <p style="
                        margin: 0;
                        color: #183b36;
                        font-size: 15px;
                        font-weight: bold;
                        line-height: 1.6;
                        word-break: break-word;
                      ">
                        ${safePhone}
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Message Heading -->
                <p style="
                  margin: 0 0 8px;
                  color: #bd9140;
                  font-size: 11px;
                  font-weight: bold;
                  letter-spacing: 2px;
                  text-transform: uppercase;
                ">
                  CUSTOMER MESSAGE
                </p>

                <h2 style="
                  margin: 0 0 16px;
                  color: #183b36;
                  font-size: 21px;
                ">
                  Inquiry Details
                </h2>

                <!-- Message Box -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    background-color: #f7f8f5;
                    border-left: 4px solid #d8ad4f;
                    border-radius: 4px;
                  "
                >
                  <tr>
                    <td style="padding: 22px;">
                      <p style="
                        margin: 0;
                        color: #43564f;
                        font-size: 14px;
                        line-height: 1.9;
                        word-break: break-word;
                      ">
                        ${safeMessage}
                      </p>
                    </td>
                  </tr>
                </table>

                <!-- Reply Guidance -->
                <table
                  role="presentation"
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="margin-top: 28px;"
                >
                  <tr>
                    <td style="
                      padding: 18px;
                      background-color: #edf4f0;
                      border-radius: 8px;
                    ">
                      <p style="
                        margin: 0 0 6px;
                        color: #183b36;
                        font-size: 14px;
                        font-weight: bold;
                      ">
                        Ready to respond?
                      </p>

                      <p style="
                        margin: 0;
                        color: #61736b;
                        font-size: 13px;
                        line-height: 1.7;
                      ">
                        Reply directly to this email to respond to the
                        customer at their submitted email address.
                      </p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="
                background-color: #123f39;
                padding: 26px 24px;
                text-align: center;
              ">

                <p style="
                  margin: 0 0 8px;
                  color: #e2b957;
                  font-size: 12px;
                  font-weight: bold;
                  letter-spacing: 2px;
                ">
                  MK Transportation
                </p>

                <p style="
                  margin: 0 0 14px;
                  color: #dce8e3;
                  font-size: 12px;
                  line-height: 1.7;
                ">
                  Reliable Logistics. Professional Service.
                </p>

                <p style="
                  margin: 0;
                  color: #a9c0b6;
                  font-size: 11px;
                  line-height: 1.8;
                ">
                  This is an automated notification from your website
                  contact form.
                  <br>
                  Please do not share this email with unauthorized parties.
                </p>

              </td>
            </tr>

            <!-- Bottom Gold Accent -->
            <tr>
              <td style="
                height: 4px;
                background-color: #d8ad4f;
                font-size: 0;
                line-height: 0;
              ">&nbsp;</td>
            </tr>

          </table>

          <p style="
            max-width: 580px;
            margin: 18px auto 0;
            color: #8a9891;
            font-size: 11px;
            line-height: 1.7;
            text-align: center;
          ">
            © MK Transportation. All rights reserved.
          </p>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `,
};

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("MAIL SENT SUCCESSFULLY =>", info.messageId);

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("CONTACT FORM ERROR =>", error.message);
    console.error("ERROR CODE =>", error.code);
    console.error("ERROR RESPONSE CODE =>", error.responseCode);
    console.error("ERROR RESPONSE =>", error.response);

    const isAuthError =
      error.code === "EAUTH" || error.responseCode === 535;

    return res.status(500).json({
      success: false,
      message: isAuthError
        ? "Email authentication failed. Please check your Gmail App Password and SMTP settings."
        : "Unable to send your message right now. Please try again later.",
    });
  }
});

module.exports = router;