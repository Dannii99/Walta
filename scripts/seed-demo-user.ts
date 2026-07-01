/**
 * Seed script for the demo user with a hashed password.
 * Run with: npx tsx scripts/seed-demo-user.ts
 *
 * Idempotent: upserts the demo user with a bcrypt hash of "demo123".
 * Safe to run multiple times.
 */

import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

config({ path: ".env" });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "demo123";

async function main() {
  const hashed = await bcrypt.hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { password: hashed },
    create: {
      email: DEMO_EMAIL,
      name: "Usuario Demo",
      password: hashed,
    },
  });

  console.log(`✓ Demo user ready: ${user.email} (id: ${user.id})`);
  console.log(`  Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });