import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.join(process.cwd(), "PROJETO", "documentacao-institucional", "assets");

const STAFF_USER = {
  email: "atendente.temp@nexusservicedesk.com",
  password: "TempAtend123!",
};

const CLIENT_USER = {
  email: "cliente.temp@nexusservicedesk.com",
  password: "TempCliente123!",
};

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function saveShot(page, filename, options = {}) {
  const outputPath = path.join(OUTPUT_DIR, filename);
  await page.screenshot({
    path: outputPath,
    fullPage: options.fullPage ?? true,
    type: "png",
  });
  return outputPath;
}

async function gotoAndSettle(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
}

async function login(page, { email, password, mode }) {
  await gotoAndSettle(page, `${BASE_URL}/auth/login`);
  await page.getByRole("button", { name: mode === "staff" ? "Atendente" : "Cliente" }).click();
  await page.getByLabel("E-mail de acesso").fill(email);
  await page.getByLabel("Senha").fill(password);
  await Promise.all([
    page.waitForURL(/\/dashboard/, { timeout: 20000 }),
    page.getByRole("button", { name: "Entrar agora" }).click(),
  ]);
  await page.waitForTimeout(1500);
}

async function setViewMode(page, mode) {
  await page.addInitScript((selectedMode) => {
    window.localStorage.setItem("i9-tickets-view-mode", selectedMode);
  }, mode);
}

async function capturePublicPages(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });
  await gotoAndSettle(page, `${BASE_URL}/`);
  await saveShot(page, "01-home-publica.png");

  await gotoAndSettle(page, `${BASE_URL}/auth/login`);
  await saveShot(page, "02-login.png");

  await gotoAndSettle(page, `${BASE_URL}/auth/register`);
  await saveShot(page, "03-cadastro.png");
  await page.close();
}

async function captureStaffPages(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1600 } });
  const page = await context.newPage();

  await login(page, { ...STAFF_USER, mode: "staff" });
  await saveShot(page, "04-dashboard-staff.png");

  await gotoAndSettle(page, `${BASE_URL}/dashboard/admin/users`);
  await saveShot(page, "05-gestao-usuarios.png");

  await setViewMode(page, "kanban");
  await gotoAndSettle(page, `${BASE_URL}/dashboard/tickets`);
  await page.waitForTimeout(600);
  await saveShot(page, "06-central-kanban-staff.png");

  await setViewMode(page, "desk");
  await gotoAndSettle(page, `${BASE_URL}/dashboard/tickets`);
  await page.waitForTimeout(600);
  await saveShot(page, "07-central-desk-staff.png");

  await gotoAndSettle(page, `${BASE_URL}/dashboard/tickets/unassigned`);
  await page.waitForTimeout(600);
  await saveShot(page, "08-fila-sem-atendente.png");

  await gotoAndSettle(page, `${BASE_URL}/dashboard/tickets/102`);
  await page.waitForTimeout(600);
  await saveShot(page, "09-ticket-humano-detalhe.png");

  await context.close();
}

async function captureClientPages(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1600 } });
  const page = await context.newPage();

  await login(page, { ...CLIENT_USER, mode: "user" });
  await saveShot(page, "10-dashboard-cliente.png");

  await gotoAndSettle(page, `${BASE_URL}/dashboard/tickets/new`);
  await saveShot(page, "11-abertura-chamado-cliente.png");

  await setViewMode(page, "desk");
  await gotoAndSettle(page, `${BASE_URL}/dashboard/tickets?view=my_open`);
  await saveShot(page, "12-chamados-cliente.png");

  await gotoAndSettle(page, `${BASE_URL}/dashboard/tickets/103`);
  await saveShot(page, "13-ticket-resolvido-ia-cliente.png");

  await context.close();
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  const browser = await chromium.launch({ headless: true });

  try {
    await capturePublicPages(browser);
    await captureStaffPages(browser);
    await captureClientPages(browser);
    console.log(`Capturas geradas em ${OUTPUT_DIR}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
