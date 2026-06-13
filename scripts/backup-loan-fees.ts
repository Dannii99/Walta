/**
 * Captura los datos actuales de `Loan.fees` (Json) antes de aplicar el
 * cambio de schema que elimina esa columna. La salida se guarda en
 * `scripts/backup-loan-fees.json` con shape:
 *   { createdAt, fees: Record<loanId, FeeItem[]> }
 *
 * Uso: npx tsx scripts/backup-loan-fees.ts
 *
 * IMPORTANTE: este script debe correrse ANTES de aplicar el nuevo schema
 * (cuando `Loan.fees` aún existe como Json). Una vez aplicada la migración,
 * este archivo es la fuente de verdad para poblar la nueva tabla `LoanFee`.
 *
 * Para re-ejecuciones en una base ya migrada, usar:
 *   `scripts/migrate-fees-to-loan-fees.ts --apply` (idempotente).
 */

import { config } from "dotenv";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

config({ path: ".env" });

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  type: "monthly" | "upfront";
}

interface LoanWithFees {
  id: string;
  title: string;
  fees: unknown;
}

const BACKUP_PATH = resolve(__dirname, "backup-loan-fees.json");

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("\n🔍 Capturando datos de Loan.fees (Json)...\n");

  // Raw query because the JSON column type doesn't expose a typed `fees`
  // accessor — we want the actual JSON string from the DB.
  const rows = await prisma.$queryRaw<LoanWithFees[]>`
    SELECT id, title, fees::text AS fees
    FROM "Loan"
  `;

  const feesByLoan: Record<string, FeeItem[]> = {};

  for (const row of rows) {
    if (!row.fees) continue;
    let parsed: unknown;
    try {
      parsed = typeof row.fees === "string" ? JSON.parse(row.fees) : row.fees;
    } catch {
      continue;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) continue;
    const fees = parsed as FeeItem[];
    feesByLoan[row.id] = fees;
    console.log(
      `  ${row.id} (${row.title}): ${fees.length} fee(s) - ${fees
        .map((f) => `${f.name} (${f.type}, $${f.amount})`)
        .join(", ")}`
    );
  }

  const payload = {
    createdAt: new Date().toISOString(),
    fees: feesByLoan,
  };

  writeFileSync(BACKUP_PATH, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`\n📦 Backup escrito: ${BACKUP_PATH}`);
  console.log(`   Total loans con fees: ${Object.keys(feesByLoan).length}`);
  console.log(
    `   Total fees: ${Object.values(feesByLoan).reduce((s, f) => s + f.length, 0)}\n`
  );
}

main()
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
