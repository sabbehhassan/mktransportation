const fs = require("fs");
const path = require("path");

const agreementTemplate = require("../templates/agreementTemplate");
const company = require("../companyDetails");

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

async function generateAgreementPDF(formData) {
  let browser;

  try {
    const puppeteerCore = await import("puppeteer-core");
    if (process.env.NODE_ENV === "production") {
      // Vercel / production
      const chromium = (await import("@sparticuz/chromium")).default;
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
      format: "Letter",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="width:100%;margin:0 0.62in;padding:0 0 4px;border-bottom:1px solid #FFB800;color:#34363A;font-family:Arial,Helvetica,sans-serif;font-size:7px;">
          <span style="font-weight:700;color:#08090B;">${escapeHtml(company.brand)}</span>
          <span style="margin-left:10px;">MC/MX/FF: ${escapeHtml(company.mcNumber)} &nbsp;|&nbsp; USDOT: ${escapeHtml(company.usdotNumber)}</span>
          <span style="float:right;">${escapeHtml(company.email)}</span>
        </div>`,
      footerTemplate: `
        <div style="width:100%;margin:0 0.62in;padding-top:4px;border-top:1px solid #FFB800;color:#62656A;font-family:Arial,Helvetica,sans-serif;font-size:7px;">
          <span>${escapeHtml(company.brand)} &middot; Trucking Service Agreement</span>
          <span style="float:right;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
      margin: {
        top: "0.72in",
        right: "0.62in",
        bottom: "0.7in",
        left: "0.62in",
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