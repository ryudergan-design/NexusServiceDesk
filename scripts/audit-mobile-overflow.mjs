import fs from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "playwright";

const BASE_URL = "http://localhost:3000";
const OUTPUT_DIR = path.join(process.cwd(), "PROJETO", "testes-mobile");
const REPORT_PATH = path.join(OUTPUT_DIR, "relatorio-mobile.md");

const USER = {
  email: "thiago.scutari@nexusservicedesk.com",
  password: "Thiago.2026",
};

const ROUTES = [
  { key: "dashboard", url: "/dashboard" },
  { key: "tickets", url: "/dashboard/tickets" },
  { key: "ticket_detail_staff", url: "/dashboard/tickets/102" },
  { key: "users_admin", url: "/dashboard/admin/users" },
];

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

function buildMarkdown(results) {
  const lines = [
    "# Relatorio Mobile",
    "",
    "- Viewport: `iPhone 13`",
    "- Data: `2026-03-15`",
    "",
  ];

  for (const result of results) {
    lines.push(`## ${result.key}`);
    lines.push("");
    lines.push(`- URL: \`${result.url}\``);
    lines.push(`- Scroll da pagina: horizontal \`${result.pageScrollWidth}\` / viewport \`${result.viewportWidth}\``);
    lines.push(`- Itens potencialmente inacessiveis: \`${result.offenders.length}\``);
    if (result.offenders.length) {
      for (const offender of result.offenders.slice(0, 8)) {
        lines.push(`- ${offender.tag} \`${offender.width}px\` :: ${offender.snippet}`);
      }
    } else {
      lines.push("- Nenhum corte horizontal critico detectado.");
    }
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();

  try {
    await login(page);
    const results = [];

    for (const route of ROUTES) {
      await gotoAndSettle(page, `${BASE_URL}${route.url}`);

      const result = await page.evaluate(() => {
        const viewportWidth = window.innerWidth;
        const pageScrollWidth = document.documentElement.scrollWidth;
        const elements = Array.from(document.querySelectorAll("body *"));

        function hasHorizontalEscape(el) {
          let current = el.parentElement;
          while (current) {
            const style = window.getComputedStyle(current);
            const canScrollX =
              (style.overflowX === "auto" || style.overflowX === "scroll") &&
              current.scrollWidth > current.clientWidth + 1;
            if (canScrollX) return true;
            current = current.parentElement;
          }
          return false;
        }

        const offenders = elements
          .map((el) => {
            const rect = el.getBoundingClientRect();
            const width = Math.round(rect.width);
            const right = Math.round(rect.right);
            const text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
            return {
              tag: el.tagName.toLowerCase(),
              width,
              right,
              snippet: text,
              accessible: hasHorizontalEscape(el),
            };
          })
          .filter((item) => item.width > viewportWidth + 8 || item.right > viewportWidth + 8)
          .filter((item) => !item.accessible);

        return { viewportWidth, pageScrollWidth, offenders };
      });

      results.push({ ...route, ...result });
    }

    await fs.writeFile(REPORT_PATH, buildMarkdown(results), "utf8");
    console.log(`Relatorio salvo em ${REPORT_PATH}`);
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
