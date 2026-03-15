import fs from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "playwright";

const BASE_URL = "http://localhost:3000";
const ROOT_DIR = path.join(process.cwd(), "PROJETO", "mudancas-visuais");
const BEFORE_TAG = "2026-03-15-baseline";
const AFTER_TAG = "2026-03-15-mobile-app";

const STAFF_USER = {
  email: "thiago.scutari@nexusservicedesk.com",
  password: "Thiago.2026",
};

const SCREENS = [
  { key: "home-publica", url: "/", auth: false },
  { key: "login", url: "/auth/login", auth: false },
  { key: "cadastro", url: "/auth/register", auth: false },
  { key: "dashboard", url: "/dashboard", auth: true },
  { key: "chamados-central", url: "/dashboard/tickets", auth: true },
  { key: "chamados-detalhe", url: "/dashboard/tickets/1", auth: true },
  { key: "fila-sem-atendente", url: "/dashboard/tickets/unassigned", auth: true },
  { key: "gestao-usuarios", url: "/dashboard/admin/users", auth: true },
  { key: "novo-chamado", url: "/dashboard/tickets/new", auth: true },
  { key: "perfil", url: "/dashboard/profile", auth: true },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyIfExists(fromPath, toPath) {
  try {
    await fs.copyFile(fromPath, toPath);
  } catch {
    // ignore when baseline does not exist
  }
}

async function gotoAndSettle(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
}

async function login(page) {
  await gotoAndSettle(page, `${BASE_URL}/auth/login`);
  await page.getByRole("button", { name: "Atendente" }).click();
  await page.getByLabel("E-mail de acesso").fill(STAFF_USER.email);
  await page.getByLabel("Senha").fill(STAFF_USER.password);
  await Promise.all([
    page.waitForURL(/\/dashboard/, { timeout: 20000 }),
    page.getByRole("button", { name: "Entrar agora" }).click(),
  ]);
  await page.waitForTimeout(1200);
}

async function captureDevice(deviceName, options, folderName) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(options);
  const page = await context.newPage();

  try {
    let loggedIn = false;

    for (const screen of SCREENS) {
      if (screen.auth && !loggedIn) {
        await login(page);
        loggedIn = true;
      }

      await gotoAndSettle(page, `${BASE_URL}${screen.url}`);

      const targetDir = path.join(ROOT_DIR, folderName, screen.key, AFTER_TAG);
      const baselineFile = path.join(ROOT_DIR, folderName, screen.key, BEFORE_TAG, "atual.png");
      await ensureDir(targetDir);
      await copyIfExists(baselineFile, path.join(targetDir, "before.png"));
      await page.screenshot({
        path: path.join(targetDir, "after.png"),
        fullPage: true,
        type: "png",
      });
    }

    console.log(`Comparativos ${deviceName} gerados.`);
  } finally {
    await context.close();
    await browser.close();
  }
}

async function main() {
  await captureDevice("desktop", { viewport: { width: 1440, height: 1600 } }, "computador");
  await captureDevice("mobile", { ...devices["iPhone 13"] }, "mobile");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
