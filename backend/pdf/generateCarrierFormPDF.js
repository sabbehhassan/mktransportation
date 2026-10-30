const fs = require("fs");
const path = require("path");

const chromium = require("@sparticuz/chromium");
const puppeteerCore = require("puppeteer-core");

const carrierFormTemplate = require("../templates/carrierFormTemplate");

async function generateCarrierFormPDF(formData) {
  let browser;

  try {
    // ==========================================
    // Launch Browser
    // ==========================================
    if (process.env.NODE_ENV === "production") {
      const executablePath = await chromium.executablePath();

      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath,
        headless: chromium.headless,
      });
    } else {
      const puppeteer = require("puppeteer");

      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
        ],
      });
    }

    // ==========================================
    // Create Page
    // ==========================================
    const page = await browser.newPage();

    // ==========================================
    // HTML
    // ==========================================
    const html = carrierFormTemplate(formData);

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // ==========================================
    // PDF Directory
    // ==========================================
    const pdfDir =
      process.env.NODE_ENV === "production"
        ? "/tmp"
        : path.join(__dirname, "../generated");

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, {
        recursive: true,
      });
    }

    const pdfPath = path.join(
      pdfDir,
      `Carrier_Form_${Date.now()}.pdf`
    );

    // ==========================================
    // Generate PDF
    // ==========================================
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    return pdfPath;
  } catch (error) {
    console.error("Carrier Form PDF Error:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = generateCarrierFormPDF;