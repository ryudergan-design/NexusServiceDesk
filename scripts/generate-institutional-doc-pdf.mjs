import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const htmlPath = path.join(ROOT, "PROJETO", "documentacao-institucional", "documentacao-institucional.html");
const pdfPath = path.join(ROOT, "PROJETO", "documentacao-institucional", "documentacao-institucional.pdf");

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "load" });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "12mm",
        right: "12mm",
        bottom: "12mm",
        left: "12mm",
      },
      preferCSSPageSize: true,
    });
    console.log(`PDF gerado em ${pdfPath}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
