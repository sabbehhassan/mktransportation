const fs = require("fs");
const path = require("path");

const agreementTemplate = require("../templates/agreementTemplate");

const chromium = require("@sparticuz/chromium");
const puppeteerCore = require("puppeteer-core");

async function generateAgreementPDF(formData) {
  let browser;

  try {
    if (process.env.NODE_ENV === "production") {
      // Vercel / production
      const executablePath = await chromium.executablePath();

      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath,
        headless: chromium.headless,
      });
    } else {
      // Local Windows development
      const possibleChromePaths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        path.join(
          process.env.LOCALAPPDATA || "",
          "Google",
          "Chrome",
          "Application",
          "chrome.exe"
        ),
      ];

      const chromePath = possibleChromePaths.find((filePath) =>
        fs.existsSync(filePath)
      );

      if (!chromePath) {
        throw new Error(
          "Google Chrome was not found. Install Chrome or configure its executable path."
        );
      }

      console.log("LOCAL CHROME FOUND =>", chromePath);

      browser = await puppeteerCore.launch({
        executablePath: chromePath,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();

    const html = agreementTemplate({
      ...formData,
      trackingId: formData.trackingId || "",
    });

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfDir =
      process.env.NODE_ENV === "production"
        ? "/tmp"
        : path.join(__dirname, "../generated");

    fs.mkdirSync(pdfDir, { recursive: true });

    const fileName = `Agreement_${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDir, fileName);

    console.log("GENERATING PDF =>", pdfPath);

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
      preferCSSPageSize: true,
    });

    if (!fs.existsSync(pdfPath)) {
      throw new Error("PDF generation failed. File not found.");
    }

    console.log("PDF GENERATED SUCCESSFULLY");

    return pdfPath;
  } catch (error) {
    console.error("PDF GENERATION ERROR =>", error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log("BROWSER CLOSED");
    }
  }
}

module.exports = generateAgreementPDF;