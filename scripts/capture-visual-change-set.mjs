import fs from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "playwright";

const BASE_URL = "http://localhost:3000";
const ROOT_DIR = path.join(process.cwd(), "PROJETO", "mudancas-visuais");
const CHANGESET_TAG = "2026-03-15-shell-mobile-cleanup";

const STAFF_USER = {
  email: "thiago.scutari@nexusservicedesk.com",
  password: "Thiago.2026",
};

const MOBILE_SCREENS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    beforeSource: path.join(ROOT_DIR, "mobile", "dashboard", "2026-03-15-mobile-app", "after.png"),
  },
  {
    title: "Central-de-Chamados",
    url: "/dashboard/tickets",
    beforeSource: path.join(ROOT_DIR, "mobile", "chamados-central", "2026-03-15-mobile-app", "after.png"),
  },
  {
    title: "Detalhe-do-Chamado",
    url: "/dashboard/tickets/1",
    beforeSource: path.join(ROOT_DIR, "mobile", "chamados-detalhe", "2026-03-15-mobile-app", "after.png"),
  },
  {
    title: "Gestao-de-Usuarios",
    url: "/dashboard/admin/users",
    beforeSource: path.join(ROOT_DIR, "mobile", "gestao-usuarios", "2026-03-15-mobile-app", "after.png"),
  },
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyIfExists(fromPath, toPath) {
  try {
    await fs.copyFile(fromPath, toPath);
  } catch {
    // ignore when a prior visual state is not available
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

async function captureMobile() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();
  const targetDir = path.join(ROOT_DIR, "mobile", CHANGESET_TAG);

  try {
    await ensureDir(targetDir);
    await login(page);

    for (const screen of MOBILE_SCREENS) {
      await copyIfExists(screen.beforeSource, path.join(targetDir, `${screen.title}-Antes.png`));
      await gotoAndSettle(page, `${BASE_URL}${screen.url}`);
      await page.screenshot({
        path: path.join(targetDir, `${screen.title}-Depois.png`),
        fullPage: true,
        type: "png",
      });
    }

    console.log("Pacote visual mobile gerado.");
  } finally {
    await context.close();
    await browser.close();
  }
}

captureMobile().catch((error) => {
  console.error(error);
  process.exit(1);
});
