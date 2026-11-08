const fs = require("fs");
const path = require("path");
const db = require("../db");
const company = require("../companyDetails");

const defaultRefundPolicy = [
  "Refund eligibility after first delivery: The onboarding deposit becomes refundable after the Carrier completes its first delivery and receives payment for that load.",
  "Refund at termination: The deposit is refundable upon termination when there are no outstanding obligations or Carrier-caused damages. The agreement's 15-day written or electronic notice requirement applies.",
  "Refund requests and documents: Contact the company for refund assistance and retain this receipt as proof of the payment recorded here. The agreement does not specify additional refund documents.",
  "Processing time: The agreement does not establish a refund-processing timeframe. Contact the company for updates.",
].join("\n\n");

const getDefaultSettings = () => ({
  companyName: company.name,
  companyBrand: company.brand,
  companyWebsite: company.website,
  companyEmail: company.email,
  companyPhone: "",
  physicalAddress: company.physicalAddress,
  mailingAddress: company.mailingAddress,
  mcNumber: company.mcNumber,
  usdotNumber: company.usdotNumber,
  logoDataUrl: `data:image/png;base64,${fs.readFileSync(
    path.join(__dirname, "../public/logo.png"),
    "base64",
  )}`,
  refundPolicy: defaultRefundPolicy,
  authorizedName: "",
  authorizedPosition: "",
  signatureDataUrl: "",
});

const mapSettings = (row) => ({
  companyName: row.company_name,
  companyBrand: row.company_brand,
  companyWebsite: row.company_website,
  companyEmail: row.company_email,
  companyPhone: row.company_phone || "",
  physicalAddress: row.physical_address || "",
  mailingAddress: row.mailing_address || "",
  mcNumber: row.mc_number || "",
  usdotNumber: row.usdot_number || "",
  logoDataUrl: row.logo_data_url || "",
  refundPolicy: row.refund_policy,
  authorizedName: row.authorized_name || "",
  authorizedPosition: row.authorized_position || "",
  signatureDataUrl: row.signature_data_url || "",
});

const cleanText = (value, label, maxLength, { required = false } = {}) => {
  if (typeof value !== "string") {
    if (required) throw new Error(`${label} is required.`);
    return "";
  }
  const cleaned = value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  if (required && !cleaned) throw new Error(`${label} is required.`);
  if (cleaned.length > maxLength) {
    throw new Error(`${label} cannot exceed ${maxLength} characters.`);
  }
  return cleaned;
};

const cleanImage = (value, label, maxLength, { required = false } = {}) => {
  if (typeof value !== "string" || !value.trim()) {
    if (required) throw new Error(`${label} is required.`);
    return "";
  }
  const cleaned = value.trim();
  if (
    cleaned.length > maxLength ||
    !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(cleaned)
  ) {
    throw new Error(`${label} must be a PNG, JPEG, or WebP image within the size limit.`);
  }
  return cleaned;
};

const normalizeSettings = (input) => ({
  companyName: cleanText(input.companyName, "Company name", 160, { required: true }),
  companyBrand: cleanText(input.companyBrand, "Company brand", 160, { required: true }),
  companyWebsite: cleanText(input.companyWebsite, "Company website", 255, { required: true }),
  companyEmail: cleanText(input.companyEmail, "Company email", 255, { required: true }),
  companyPhone: cleanText(input.companyPhone, "Company phone", 80),
  physicalAddress: cleanText(input.physicalAddress, "Physical address", 255),
  mailingAddress: cleanText(input.mailingAddress, "Mailing address", 255),
  mcNumber: cleanText(input.mcNumber, "MC number", 80),
  usdotNumber: cleanText(input.usdotNumber, "USDOT number", 80),
  logoDataUrl: cleanImage(input.logoDataUrl, "Company logo", 3_000_000, {
    required: true,
  }),
  refundPolicy: cleanText(input.refundPolicy, "Refund policy", 6000, {
    required: true,
  }),
  authorizedName: cleanText(input.authorizedName, "Authorized representative", 160),
  authorizedPosition: cleanText(input.authorizedPosition, "Authorized position", 160),
  signatureDataUrl: cleanImage(
    input.signatureDataUrl,
    "Authorized signature",
    420_000,
  ),
});

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getReceiptSettings = async () => {
  const [rows] = await db.query(
    "SELECT * FROM refundable_receipt_settings WHERE id = 1 LIMIT 1",
  );
  return rows.length ? mapSettings(rows[0]) : getDefaultSettings();
};

const saveReceiptSettings = async (input, adminEmail) => {
  const settings = normalizeSettings(input);
  if (!isValidEmail(settings.companyEmail)) {
    throw new Error("Enter a valid company contact email address.");
  }
  await db.query(
    `INSERT INTO refundable_receipt_settings (
       id, company_name, company_brand, company_website, company_email,
       company_phone, physical_address, mailing_address, mc_number, usdot_number,
       logo_data_url, refund_policy, authorized_name, authorized_position,
       signature_data_url, updated_by
     ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       company_name = VALUES(company_name),
       company_brand = VALUES(company_brand),
       company_website = VALUES(company_website),
       company_email = VALUES(company_email),
       company_phone = VALUES(company_phone),
       physical_address = VALUES(physical_address),
       mailing_address = VALUES(mailing_address),
       mc_number = VALUES(mc_number),
       usdot_number = VALUES(usdot_number),
       logo_data_url = VALUES(logo_data_url),
       refund_policy = VALUES(refund_policy),
       authorized_name = VALUES(authorized_name),
       authorized_position = VALUES(authorized_position),
       signature_data_url = VALUES(signature_data_url),
       updated_by = VALUES(updated_by)`,
    [
      settings.companyName,
      settings.companyBrand,
      settings.companyWebsite,
      settings.companyEmail,
      settings.companyPhone || null,
      settings.physicalAddress || null,
      settings.mailingAddress || null,
      settings.mcNumber || null,
      settings.usdotNumber || null,
      settings.logoDataUrl,
      settings.refundPolicy,
      settings.authorizedName || null,
      settings.authorizedPosition || null,
      settings.signatureDataUrl || null,
      adminEmail,
    ],
  );
  return settings;
};

module.exports = {
  cleanText,
  getReceiptSettings,
  normalizeSettings,
  saveReceiptSettings,
};
