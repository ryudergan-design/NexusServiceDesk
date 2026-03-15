import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const sqliteSchemaPath = path.join(rootDir, "prisma", "schema.prisma");
const supabaseSchemaPath = path.join(rootDir, "BANCO_DE_DADOS", "SUPABASE", "prisma", "schema.supabase.prisma");
const mirrorStatePath = path.join(rootDir, "BANCO_DE_DADOS", "SUPABASE", "prisma", "mirror-state.json");

const mode = process.argv[2] || "check";

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function readUtf8(filePath) {
  return readFileSync(filePath, "utf8");
}

function buildState() {
  const sqliteSchema = readUtf8(sqliteSchemaPath);
  const supabaseSchema = readUtf8(supabaseSchemaPath);

  return {
    source: "prisma/schema.prisma",
    mirror: "BANCO_DE_DADOS/SUPABASE/prisma/schema.supabase.prisma",
    sourceHash: sha256(sqliteSchema),
    mirrorHash: sha256(supabaseSchema),
    updatedAt: new Date().toISOString(),
  };
}

function readState() {
  if (!existsSync(mirrorStatePath)) return null;
  return JSON.parse(readUtf8(mirrorStatePath));
}

function writeState(state) {
  writeFileSync(mirrorStatePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

if (mode === "update") {
  const nextState = buildState();
  writeState(nextState);
  console.log("Estado do espelho Supabase atualizado com sucesso.");
  console.log(`sourceHash=${nextState.sourceHash}`);
  process.exit(0);
}

if (mode !== "check") {
  console.error('Modo invalido. Use "check" ou "update".');
  process.exit(1);
}

const currentState = buildState();
const storedState = readState();

if (!storedState) {
  console.error("Espelho Supabase sem estado registrado. Rode: npm run db:mirror:update");
  process.exit(1);
}

if (storedState.sourceHash !== currentState.sourceHash) {
  console.error("O schema SQLite mudou e o espelho do Supabase precisa ser revisado.");
  console.error("Depois de revisar o schema espelho, rode: npm run db:mirror:update");
  process.exit(1);
}

console.log("Espelho Supabase em dia com o schema principal.");
