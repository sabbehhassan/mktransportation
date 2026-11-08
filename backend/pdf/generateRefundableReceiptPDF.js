const fs = require("fs");
const path = require("path");
const puppeteerCore = require("puppeteer-core");
const refundableReceiptTemplate = require("../templates/refundableReceiptTemplate");

async function generateRefundableReceiptPDF(receipt) {
  let browser;
  try {
    if (process.env.NODE_ENV === "production") {
      const chromium = (await import("@sparticuz/chromium")).default;
      browser = await puppeteerCore.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      const chromePaths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        path.join(
          process.env.LOCALAPPDATA || "",
          "Google",
          "Chrome",
          "Application",
          "chrome.exe",
        ),
      ];
      const chromePath = chromePaths.find((candidate) => fs.existsSync(candidate));
      if (!chromePath) {
        throw new Error(
          "Google Chrome was not found. Install Chrome or configure its executable path.",
        );
      }
      browser = await puppeteerCore.launch({
        executablePath: chromePath,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();
    await page.setContent(refundableReceiptTemplate(receipt), {
      waitUntil: "load",
    });
    return await page.pdf({
      format: "Letter",
      printBackground: true,
      margin: {
        top: "0.45in",
        right: "0.45in",
        bottom: "0.45in",
        left: "0.45in",
      },
    });
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = generateRefundableReceiptPDF;
