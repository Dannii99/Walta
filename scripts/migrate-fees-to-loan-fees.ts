/**
 * Migración idempotente de `Loan.fees` (Json inline) a la nueva tabla `LoanFee`.
 *
 * Contexto:
 *  - Antes: cada loan tenía un campo `fees: Json` con shape `[{ id, name, amount, type }]`.
 *  - Después: cada fee es una fila en la tabla relacional `LoanFee` con FK a `Loan`.
 *  - Esta migración preserva los IDs originales (vienen del backup).
 *
 * Pre-requisito:
 *  1. Haber corrido `scripts/backup-loan-fees.ts` (genera `scripts/backup-loan-fees.json`).
 *  2. Haber aplicado el nuevo schema con `npx prisma db push`.
 *
 * Uso:
 *  - Dry-run (default):  npx tsx scripts/migrate-fees-to-loan-fees.ts
 *  - Aplicar migración:  npx tsx scripts/migrate-fees-to-loan-fees.ts --apply
 *
 * Idempotencia:
 *  - En re-ejecuciones, si ya existe un LoanFee con el mismo id, se omite.
 *
 * Importante: requiere `.env` con `DATABASE_URL` apuntando a la base a migrar.
 */

import { config } from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

config({ path: ".env" });

const BACKUP_PATH = resolve(__dirname, "backup-loan-fees.json");
const APPLY = process.argv.includes("--apply");

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  type: "monthly" | "upfront";
}

interface BackupShape {
  createdAt: string;
  fees: Record<string, FeeItem[]>;
}

function loadBackup(): BackupShape {
  if (!existsSync(BACKUP_PATH)) {
    console.error(`❌ No se encontró el backup: ${BACKUP_PATH}`);
    console.error("   Corre primero: npx tsx scripts/backup-loan-fees.ts");
    throw new Error("Backup file not found");
  }
  try {
    return JSON.parse(readFileSync(BACKUP_PATH, "utf-8")) as BackupShape;
  } catch (err) {
    console.error("❌ Backup existe pero no se pudo parsear:", err);
    throw err;
  }
}

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(
    `\n🔄 Migración FEES JSON -> LoanFee — modo: ${
      APPLY ? "APPLY" : "DRY-RUN"
    }\n`
  );

  const backup = loadBackup();
  const feesByLoan = backup.fees;

  if (Object.keys(feesByLoan).length === 0) {
    console.log("ℹ️  No hay fees en el backup. Nada que migrar.");
    return;
  }

  let totalInserted = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const [loanId, fees] of Object.entries(feesByLoan)) {
    console.log(`\n  Loan: ${loanId} (${fees.length} fee(s))`);

    // Verify loan exists
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      select: { id: true, title: true },
    });
    if (!loan) {
      console.log(`    ⚠ Loan no existe en DB. Saltando.`);
      totalErrors++;
      continue;
    }
    console.log(`    title: ${loan.title}`);

    for (const fee of fees) {
      // Idempotency check
      const existing = await prisma.loanFee.findUnique({
        where: { id: fee.id },
        select: { id: true },
      });

      if (existing) {
        console.log(
          `    ⊘ ${fee.id} ${fee.name} (${fee.type}, $${fee.amount}) — ya existe, skip`
        );
        totalSkipped++;
        continue;
      }

      if (APPLY) {
        await prisma.loanFee.create({
          data: {
            id: fee.id,
            loanId,
            name: fee.name,
            amount: fee.amount,
            type: fee.type,
          },
        });
        console.log(
          `    ✓ ${fee.id} ${fee.name} (${fee.type}, $${fee.amount}) — insertado`
        );
        totalInserted++;
      } else {
        console.log(
          `    → ${fee.id} ${fee.name} (${fee.type}, $${fee.amount}) — sería insertado`
        );
        totalInserted++;
      }
    }
  }

  console.log(
    `\n📊 Resumen: ${totalInserted} ${
      APPLY ? "insertados" : "serían insertados"
    }, ${totalSkipped} skipped, ${totalErrors} errores`
  );

  if (!APPLY) {
    console.log(
      "\n⚠ DRY-RUN. Para aplicar: npx tsx scripts/migrate-fees-to-loan-fees.ts --apply\n"
    );
  } else {
    console.log("\n✅ Migración aplicada.\n");
  }
}

main()
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
