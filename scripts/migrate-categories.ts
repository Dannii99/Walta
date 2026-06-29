/**
 * Migration script: consolidate legacy flat categories into the new grouped
 * 12-category system. Moves transactions from old categories to the new ones
 * and deletes the old (now empty) categories.
 *
 * Usage:
 *   npx tsx scripts/migrate-categories.ts          # dry-run (prints plan)
 *   npx tsx scripts/migrate-categories.ts --apply  # executes migration
 *
 * Idempotent: if a budget already has the new category, transactions are
 * simply re-routed there and the old category is deleted. A backup JSON
 * with the pre-migration state is written to scripts/migrate-categories.backup.json
 */

import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import { PREDEFINED_CATEGORIES, CATEGORY_MAP } from "../lib/categories";

config({ path: ".env" });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const isApply = process.argv.includes("--apply");

const TYPE_COLORS: Record<string, string> = {
  NEEDS: "#26be15",
  WANTS: "#e7964d",
  SAVINGS: "#617dd5",
  DEBT: "#9333ea",
};

interface BackupEntry {
  budgetId: string;
  oldCategories: { id: string; name: string; type: string; txCount: number }[];
  newCategory: { name: string; type: string; icon: string; description: string } | null;
  migratedTx: number;
}

async function main() {
  console.log(isApply ? "=== APPLY MODE ===" : "=== DRY RUN (use --apply to execute) ===");

  const budgets = await prisma.budget.findMany({
    include: {
      categories: {
        include: { _count: { select: { transactions: true } } },
      },
    },
  });

  console.log(`Found ${budgets.length} budget(s).`);

  const backup: BackupEntry[] = [];
  let totalMigrated = 0;
  let totalDeleted = 0;

  for (const budget of budgets) {
    console.log(`\nBudget: ${budget.name} (${budget.id})`);

    const newCatByName = new Map(
      PREDEFINED_CATEGORIES.map((c) => [c.name.toLowerCase(), c])
    );

    for (const [oldName, newName] of Object.entries(CATEGORY_MAP)) {
      const oldCats = budget.categories.filter(
        (c) => c.name.toLowerCase() === oldName.toLowerCase()
      );
      if (oldCats.length === 0) continue;

      const predef = newCatByName.get(newName.toLowerCase());
      if (!predef) {
        console.log(`  ? No predefined match for "${newName}" — skipping.`);
        continue;
      }

      const totalTx = oldCats.reduce(
        (s, c) => s + c._count.transactions,
        0
      );
      console.log(
        `  "${oldName}" → "${newName}" (${totalTx} tx across ${oldCats.length} cat(s))`
      );

      backup.push({
        budgetId: budget.id,
        oldCategories: oldCats.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
          txCount: c._count.transactions,
        })),
        newCategory: {
          name: predef.name,
          type: predef.type,
          icon: predef.icon,
          description: predef.description,
        },
        migratedTx: totalTx,
      });

      if (!isApply) continue;

      const existingNew = budget.categories.find(
        (c) => c.name.toLowerCase() === newName.toLowerCase()
      );

      let newCatId: string;
      if (existingNew) {
        newCatId = existingNew.id;
        await prisma.category.update({
          where: { id: existingNew.id },
          data: {
            icon: predef.icon,
            description: predef.description,
            type: predef.type,
          },
        });
      } else {
        const created = await prisma.category.create({
          data: {
            budgetId: budget.id,
            name: predef.name,
            type: predef.type,
            color: TYPE_COLORS[predef.type] ?? "#3B82F6",
            icon: predef.icon,
            description: predef.description,
          },
        });
        newCatId = created.id;
      }

      for (const old of oldCats) {
        if (old.id === newCatId) continue;
        await prisma.transaction.updateMany({
          where: { categoryId: old.id },
          data: { categoryId: newCatId },
        });
        await prisma.category.delete({ where: { id: old.id } });
      }

      totalMigrated += totalTx;
      totalDeleted += oldCats.filter((c) => c.id !== newCatId).length;
    }

    for (const c of budget.categories) {
      const predef = newCatByName.get(c.name.toLowerCase());
      if (predef && (!c.icon || !c.description)) {
        console.log(`  ⟳ Update existing "${c.name}" with icon/description`);
        if (isApply) {
          await prisma.category.update({
            where: { id: c.id },
            data: { icon: predef.icon, description: predef.description },
          });
        }
      }
    }
  }

  console.log(`\nSummary:`);
  console.log(`  Transactions migrated: ${totalMigrated}`);
  console.log(`  Old categories deleted: ${totalDeleted}`);
  console.log(`  Backup entries: ${backup.length}`);

  if (backup.length > 0) {
    const fs = await import("node:fs/promises");
    await fs.writeFile(
      "scripts/migrate-categories.backup.json",
      JSON.stringify({ createdAt: new Date().toISOString(), backup }, null, 2),
      "utf-8"
    );
    console.log("  Backup written to scripts/migrate-categories.backup.json");
  }

  if (!isApply) {
    console.log("\nDry-run complete. Run with --apply to execute.");
  } else {
    console.log("\nMigration complete.");
  }
}

main()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });