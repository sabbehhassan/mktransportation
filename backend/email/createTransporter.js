const nodemailer = require("nodemailer");

const createTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, EMAIL_FROM } =
    process.env;
  const port = Number(SMTP_PORT);
  if (
    !SMTP_HOST ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !["true", "false"].includes(String(SMTP_SECURE).toLowerCase()) ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !EMAIL_FROM
  ) {
    throw new Error("SMTP email delivery is not configured.");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: String(SMTP_SECURE).toLowerCase() === "true",
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

module.exports = createTransporter;
