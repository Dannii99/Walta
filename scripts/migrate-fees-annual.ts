/**
 * Migración idempotente de cargos adicionales (fees) mensuales a almacenar el valor ANUAL.
 *
 * Contexto:
 *  - Antes: el campo `fee.amount` (para type="monthly") guardaba el valor mensual
 *    (ej. $50.000/mes para un seguro que en realidad cuesta $600.000/año).
 *  - Después: el campo `fee.amount` guarda el valor ANUAL ($600.000), y el motor
 *    divide entre 12 (constante `ANNUAL_TO_MONTHLY`) para obtener el cobro mensual.
 *  - Server actions: `createLoan` / `updateLoan` aceptan el shape tal cual; los
 *    consumidores (`calculateTotalMonthlyFees`, `LoanPreviewCard`, AI prompts)
 *    ya muestran el valor mensual correcto gracias a la división por 12.
 *
 * **Actualización 2026-06-06**: los fees ahora viven en la tabla relacional
 * `LoanFee` (no en `Loan.fees Json`). El script opera sobre esa tabla.
 *
 * Este script migra los registros existentes en producción.
 *
 * Uso:
 *  - Dry-run (default):  npx tsx scripts/migrate-fees-annual.ts
 *  - Aplicar migración:  npx tsx scripts/migrate-fees-annual.ts --apply
 *
 * Idempotencia:
 *  - El script crea `scripts/migrate-fees-annual.backup.json` con los amounts
 *    ORIGINALES (mensuales) antes de aplicar cualquier cambio.
 *  - En re-ejecuciones, compara cada fee mensual actual con el backup:
 *      * amount actual == amount backup  →  aún no migrado, se aplica ×12.
 *      * amount actual != amount backup  →  ya migrado o modificado, se omite.
 *
 * Importante: requiere `.env` con `DATABASE_URL` apuntando a la base a migrar.
 */

import { config } from "dotenv";
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

config({ path: ".env" });

const ANNUAL_FACTOR = 12;
const BACKUP_PATH = resolve(__dirname, "migrate-fees-annual.backup.json");
const APPLY = process.argv.includes("--apply");

interface FeeEntry {
  id: string;
  loanId: string;
  loanTitle: string;
  name: string;
  amount: number;
  type: "monthly" | "upfront";
}

interface BackupShape {
  createdAt: string;
  // loanId → { feeId → originalMonthlyAmount }
  fees: Record<string, Record<string, number>>;
}

function loadBackup(): BackupShape | null {
  if (!existsSync(BACKUP_PATH)) return null;
  try {
    return JSON.parse(readFileSync(BACKUP_PATH, "utf-8")) as BackupShape;
  } catch (err) {
    console.error("⚠ Backup existe pero no se pudo parsear:", err);
    return null;
  }
}

function writeBackup(entries: Record<string, Record<string, number>>): void {
  const payload: BackupShape = {
    createdAt: new Date().toISOString(),
    fees: entries,
  };
  writeFileSync(BACKUP_PATH, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`📦 Backup escrito: ${BACKUP_PATH}`);
}

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(
    `\n🔄 Migración FEES ANUAL — modo: ${APPLY ? "APPLY" : "DRY-RUN"}\n`
  );

  // Fetch all LoanFee rows (including their parent loan's title for display).
  const fees = await prisma.loanFee.findMany({
    where: { type: "monthly" },
    include: { loan: { select: { id: true, title: true } } },
  });

  const candidates: FeeEntry[] = fees
    .filter((f) => !!f.loan)
    .map((f) => ({
      id: f.id,
      loanId: f.loanId,
      loanTitle: f.loan.title,
      name: f.name,
      amount: Number(f.amount),
      type: "monthly" as const,
    }));

  console.log(
    `📊 Encontrados: ${candidates.length} cargos mensuales en tabla LoanFee\n`
  );

  if (candidates.length === 0) {
    console.log("✅ Nada que migrar. Saliendo.");
    return;
  }

  const backup = loadBackup();
  interface Migration {
    feeId: string;
    loanId: string;
    loanTitle: string;
    feeName: string;
    oldAmount: number;
    newAmount: number;
  }

  const toMigrate: Migration[] = [];
  let alreadyMigrated = 0;
  let newSinceBackup = 0;

  if (!backup) {
    console.log("⚠ No hay backup previo. Asumiendo migración completa.");
    console.log(
      "  Si estás seguro de que es la primera ejecución, continúa con --apply."
    );
    for (const fee of candidates) {
      toMigrate.push({
        feeId: fee.id,
        loanId: fee.loanId,
        loanTitle: fee.loanTitle,
        feeName: fee.name,
        oldAmount: fee.amount,
        newAmount: Math.round(fee.amount * ANNUAL_FACTOR),
      });
    }
  } else {
    for (const fee of candidates) {
      const loanBackup = backup.fees[fee.loanId];
      if (!loanBackup || loanBackup[fee.id] === undefined) {
        newSinceBackup++;
        continue;
      }
      const currentAmount = fee.amount;
      const original = loanBackup[fee.id];
      if (Math.abs(currentAmount - original) < 0.5) {
        toMigrate.push({
          feeId: fee.id,
          loanId: fee.loanId,
          loanTitle: fee.loanTitle,
          feeName: fee.name,
          oldAmount: original,
          newAmount: Math.round(currentAmount * ANNUAL_FACTOR),
        });
      } else {
        alreadyMigrated++;
      }
    }
  }

  if (newSinceBackup > 0) {
    console.log(
      `ℹ ${newSinceBackup} cargos mensuales creados después del backup (omitidos)`
    );
  }

  console.log(
    `📋 Resumen: ${toMigrate.length} a migrar, ${alreadyMigrated} ya migrados\n`
  );

  if (toMigrate.length === 0) {
    console.log("✅ Todos los cargos mensuales ya están migrados. Saliendo.");
    return;
  }

  console.log("─".repeat(96));
  console.log(
    "FeeID".padEnd(28) +
      "Cargo".padEnd(28) +
      "old (mensual)".padStart(14) +
      "→".padStart(4) +
      "new (anual)".padStart(14)
  );
  console.log("─".repeat(96));
  for (const m of toMigrate) {
    console.log(
      m.feeId.padEnd(28) +
        m.feeName.padEnd(28) +
        m.oldAmount.toLocaleString("es-CO").padStart(14) +
        " →".padStart(4) +
        m.newAmount.toLocaleString("es-CO").padStart(14)
    );
  }
  console.log("─".repeat(96));

  if (!APPLY) {
    console.log("\n🟡 DRY-RUN: no se aplicaron cambios. Usa --apply para migrar.");
    return;
  }

  if (!backup) {
    const entries: Record<string, Record<string, number>> = {};
    for (const m of toMigrate) {
      if (!entries[m.loanId]) entries[m.loanId] = {};
      entries[m.loanId][m.feeId] = m.oldAmount;
    }
    writeBackup(entries);
  }

  let success = 0;
  let failed = 0;

  for (const m of toMigrate) {
    try {
      await prisma.loanFee.update({
        where: { id: m.feeId },
        data: { amount: m.newAmount },
      });
      success++;
    } catch (err) {
      failed++;
      console.error(`✗ Error migrando fee ${m.feeId}:`, err);
    }
  }

  console.log(
    `\n✅ Migración aplicada: ${success} cargos exitosos, ${failed} fallidos.`
  );
  console.log(`📦 Backup disponible en: ${BACKUP_PATH}`);
}

main()
  .catch((err) => {
    console.error("💥 Error fatal:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
