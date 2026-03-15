import fs from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "playwright";

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.join(process.cwd(), "PROJETO", "mudancas-visuais", "mobile", "chamados-detalhe", "2026-03-15-wrap-e-scroll");
const outputName = process.argv[2] || "before.png";

const USER = {
  email: "thiago.scutari@nexusservicedesk.com",
  password: "Thiago.2026",
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function gotoAndSettle(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
}

async function login(page) {
  await gotoAndSettle(page, `${BASE_URL}/auth/login`);
  await page.getByRole("button", { name: "Atendente" }).click();
  await page.getByLabel("E-mail de acesso").fill(USER.email);
  await page.getByLabel("Senha").fill(USER.password);
  await Promise.all([
    page.waitForURL(/\/dashboard/, { timeout: 20000 }),
    page.getByRole("button", { name: "Entrar agora" }).click(),
  ]);
  await page.waitForTimeout(1200);
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices["iPhone 13"] });

  try {
    const page = await context.newPage();
    await login(page);
    await gotoAndSettle(page, `${BASE_URL}/dashboard/tickets/102`);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, outputName),
      fullPage: true,
      type: "png",
    });
    console.log(`Screenshot salvo em ${path.join(OUTPUT_DIR, outputName)}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
