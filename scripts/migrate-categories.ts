/**
 * Backfill migration: ensure every budget has all 12 predefined categories
 * with `plannedAmount = null`. Categories with old names are merged first
 * using CATEGORY_MAP (primary direction). Idempotent, dry-run by default
 * (use --apply to write).
 *
 * Usage:
 *   npx tsx scripts/migrate-categories.ts            # dry-run
 *   npx tsx scripts/migrate-categories.ts --apply    # write
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

const TYPE_COLORS: Record<string, string> = {
  NEEDS: "#26be15",
  WANTS: "#e7964d",
  SAVINGS: "#617dd5",
  DEBT: "#9333ea",
};

function normalizeName(name: string): string {
  return (CATEGORY_MAP[name] ?? name).trim();
}

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(apply ? "[APPLY]" : "[DRY-RUN]", "Backfilling 12 predefined categories per budget");

  const budgets = await prisma.budget.findMany({
    include: { categories: { include: { transactions: true } } },
  });
  console.log(`Budgets: ${budgets.length}`);

  let totalCreated = 0;
  let totalMerged = 0;
  const backup: Record<string, any> = {};

  for (const budget of budgets) {
    console.log(`\n[Budget ${budget.id}] "${budget.name}"`);

    for (const predef of PREDEFINED_CATEGORIES) {
      const existingExact = budget.categories.find((c) => c.name === predef.name);

      if (existingExact) {
        continue;
      }

      const legacyHit = budget.categories.find(
        (c) => normalizeName(c.name) === predef.name && c.name !== predef.name
      );

      if (legacyHit) {
        const targetUserFacing = budget.categories.find((c) => c.name === predef.name);
        if (targetUserFacing) {
          if (legacyHit.transactions.length > 0) {
            console.log(`  Reassigning ${legacyHit.transactions.length} txs: "${legacyHit.name}" -> "${predef.name}"`);
            backup[budget.id] = backup[budget.id] ?? {};
            backup[budget.id][legacyHit.id] = {
              oldName: legacyHit.name,
              txIds: legacyHit.transactions.map((t) => t.id),
            };
            if (apply) {
              await prisma.transaction.updateMany({
                where: { categoryId: legacyHit.id },
                data: { categoryId: targetUserFacing.id },
              });
            }
            totalMerged++;
          }
          if (apply) {
            await prisma.category.delete({ where: { id: legacyHit.id } });
          }
          console.log(`  Merged legacy "${legacyHit.name}" into "${predef.name}"`);
        } else {
          if (apply) {
            await prisma.category.update({
              where: { id: legacyHit.id },
              data: {
                name: predef.name,
                type: predef.type,
                icon: predef.icon,
                description: predef.description,
                color: legacyHit.color || TYPE_COLORS[predef.type],
              },
            });
          }
          console.log(`  Renamed legacy "${legacyHit.name}" -> "${predef.name}"`);
        }
        continue;
      }

      console.log(`  Creating missing predefined "${predef.name}" (${predef.type})`);
      if (apply) {
        await prisma.category.create({
          data: {
            budgetId: budget.id,
            name: predef.name,
            type: predef.type,
            color: TYPE_COLORS[predef.type],
            icon: predef.icon,
            description: predef.description,
            plannedAmount: null,
          },
        });
      }
      totalCreated++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Categories created: ${totalCreated}`);
  console.log(`Legacy merges: ${totalMerged}`);
  if (!apply) {
    console.log("Dry-run complete. Run with --apply to write changes.");
  } else {
    console.log("Changes applied successfully.");
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});