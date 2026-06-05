/**
 * Migración idempotente de transacciones BIWEEKLY a almacenar el equivalente mensual.
 *
 * Contexto:
 *  - Antes: el campo `amount` guardaba el valor por pago (ej. $50.000 cada quincena).
 *  - Después: el campo `amount` guarda el equivalente mensual ($100.000 = 2 pagos).
 *  - Server actions: `createTransaction` / `updateTransaction` aplican `toStoredAmount`
 *    automáticamente para escrituras nuevas.
 *
 * Este script migra los registros existentes en producción.
 *
 * Uso:
 *  - Dry-run (default):  npx tsx scripts/migrate-biweekly.ts
 *  - Aplicar migración:  npx tsx scripts/migrate-biweekly.ts --apply
 *
 * Idempotencia:
 *  - El script crea `scripts/migrate-biweekly.backup.json` con los amounts ORIGINALES
 *    antes de aplicar cualquier cambio.
 *  - En re-ejecuciones, compara cada BIWEEKLY actual con el backup:
 *      * amount actual == amount backup  →  aún no migrado, se aplica ×2.
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

const BIWEEKLY_FACTOR = 2;
const BACKUP_PATH = resolve(__dirname, "migrate-biweekly.backup.json");
const APPLY = process.argv.includes("--apply");

interface BackupShape {
  createdAt: string;
  transactions: Record<string, number>;
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

function writeBackup(entries: Record<string, number>): void {
  const payload: BackupShape = {
    createdAt: new Date().toISOString(),
    transactions: entries,
  };
  writeFileSync(BACKUP_PATH, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`📦 Backup escrito: ${BACKUP_PATH}`);
}

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

interface Row {
  id: string;
  categoryId: string;
  amount: string;
}

async function main() {
  console.log(
    `\n🔄 Migración BIWEEKLY — modo: ${APPLY ? "APPLY" : "DRY-RUN"}\n`
  );

  const biweekly = (await prisma.transaction.findMany({
    where: { recurrence: "BIWEEKLY" },
    select: { id: true, categoryId: true, amount: true },
  })) as unknown as Row[];

  console.log(`📊 Encontradas: ${biweekly.length} transacciones BIWEEKLY\n`);

  if (biweekly.length === 0) {
    console.log("✅ Nada que migrar. Saliendo.");
    return;
  }

  const backup = loadBackup();
  let toMigrate: Array<{ row: Row; oldAmount: number; newAmount: number }> = [];
  let alreadyMigrated = 0;
  let newSinceBackup = 0;

  if (!backup) {
    console.log("⚠ No hay backup previo. Asumiendo migración completa.");
    console.log(
      "  Si estás seguro de que es la primera ejecución, continúa con --apply."
    );
    toMigrate = biweekly.map((row) => {
      const oldAmount = Number(row.amount);
      return {
        row,
        oldAmount,
        newAmount: Math.round(oldAmount * BIWEEKLY_FACTOR),
      };
    });
  } else {
    for (const row of biweekly) {
      const currentAmount = Number(row.amount);
      const original = backup.transactions[row.id];
      if (original === undefined) {
        newSinceBackup++;
        continue;
      }
      if (Math.abs(currentAmount - original) < 0.5) {
        toMigrate.push({
          row,
          oldAmount: original,
          newAmount: Math.round(currentAmount * BIWEEKLY_FACTOR),
        });
      } else {
        alreadyMigrated++;
      }
    }
  }

  if (newSinceBackup > 0) {
    console.log(
      `ℹ ${newSinceBackup} transacciones BIWEEKLY creadas después del backup (omitidas)`
    );
  }

  console.log(
    `📋 Resumen: ${toMigrate.length} a migrar, ${alreadyMigrated} ya migradas\n`
  );

  if (toMigrate.length === 0) {
    console.log("✅ Todas las transacciones ya están migradas. Saliendo.");
    return;
  }

  console.log("─".repeat(78));
  console.log(
    "ID".padEnd(28) +
      "categoryId".padEnd(28) +
      "old".padStart(12) +
      "→".padStart(4) +
      "new".padStart(12)
  );
  console.log("─".repeat(78));
  for (const m of toMigrate) {
    console.log(
      m.row.id.padEnd(28) +
        m.row.categoryId.padEnd(28) +
        m.oldAmount.toLocaleString("es-CO").padStart(12) +
        " →".padStart(4) +
        m.newAmount.toLocaleString("es-CO").padStart(12)
    );
  }
  console.log("─".repeat(78));

  if (!APPLY) {
    console.log("\n🟡 DRY-RUN: no se aplicaron cambios. Usa --apply para migrar.");
    return;
  }

  if (!backup) {
    const entries: Record<string, number> = {};
    for (const m of toMigrate) entries[m.row.id] = m.oldAmount;
    writeBackup(entries);
  }

  let success = 0;
  let failed = 0;
  for (const m of toMigrate) {
    try {
      await prisma.transaction.update({
        where: { id: m.row.id },
        data: { amount: m.newAmount },
      });
      success++;
    } catch (err) {
      failed++;
      console.error(`✗ Error migrando ${m.row.id}:`, err);
    }
  }

  console.log(
    `\n✅ Migración aplicada: ${success} exitosas, ${failed} fallidas.`
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
