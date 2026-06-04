/**
 * Seed script for the timeline demo experience.
 * Run with: npx tsx scripts/seed-timeline-demo.ts
 *
 * Creates 2 simulations (1 approved → converted into a loan, 1 rejected),
 * 1 active loan with 8 payments spread across multiple months, and
 * 2 capital contributions, all attributed to the demo user.
 *
 * Idempotent: detects existing data via deterministic IDs and skips.
 */

import { config } from "dotenv";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

config({ path: ".env" });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@example.com";

const SIM_VEHICLE_ID = "seed-sim-vehicle-approved";
const SIM_HOUSING_ID = "seed-sim-housing-rejected";
const LOAN_ID = "seed-loan-car-2026";
const EXTRA_PREFIX = "seed-extra-";

function monthsAgo(months: number): Date {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(15);
  d.setHours(10, 0, 0, 0);
  return d;
}

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  });

  if (!user) {
    console.error(`Demo user (${DEMO_EMAIL}) not found. Run the app once to seed the user.`);
    process.exit(1);
  }

  const userId = user.id;
  console.log(`Seeding timeline demo data for user ${userId}…`);

  const simVehicle = await prisma.simulation.upsert({
    where: { id: SIM_VEHICLE_ID },
    create: {
      id: SIM_VEHICLE_ID,
      userId,
      type: "VEHICLE",
      title: "Carro 2026",
      inputs: {
        price: 50_000_000,
        downPayment: 8_000_000,
        term: 72,
        rate: 0.1718,
        formula: "french_ea",
      },
      result: {
        monthlyPayment: 1_018_463.5,
        verdict: "APPROVED",
        availableAfter: 401_700,
        totalInterest: 26_289_376,
        totalCost: 76_289_376,
      },
      createdAt: monthsAgo(7),
    },
    update: {},
  });
  console.log(`  Simulation: ${simVehicle.title} (${simVehicle.id})`);

  const simHousing = await prisma.simulation.upsert({
    where: { id: SIM_HOUSING_ID },
    create: {
      id: SIM_HOUSING_ID,
      userId,
      type: "HOUSING",
      title: "Apartamento en Chapinero",
      inputs: {
        price: 350_000_000,
        downPayment: 70_000_000,
        term: 120,
        rate: 0.1245,
        formula: "french_ea",
      },
      result: {
        monthlyPayment: 3_842_510,
        verdict: "REJECTED",
        availableAfter: -2_440_810,
        totalInterest: 181_101_200,
        totalCost: 461_101_200,
      },
      createdAt: monthsAgo(6),
    },
    update: {},
  });
  console.log(`  Simulation: ${simHousing.title} (${simHousing.id})`);

  const loan = await prisma.loan.upsert({
    where: { id: LOAN_ID },
    create: {
      id: LOAN_ID,
      userId,
      simulationId: SIM_VEHICLE_ID,
      title: "Carro 2026",
      type: "VEHICLE",
      principal: 47_000_000,
      downPayment: 3_000_000,
      annualRate: 0.1718,
      termMonths: 72,
      formula: "french_ea",
      monthlyPayment: 1_018_463.5,
      totalInterest: 26_289_376,
      totalCost: 73_289_376,
      paidInstallments: 8,
      fees: [
        { id: "seed-fee-1", name: "Administración mensual", amount: 35_000, type: "monthly" },
        { id: "seed-fee-2", name: "Seguro anual", amount: 1_200_000, type: "upfront" },
      ],
      createdAt: monthsAgo(5),
      startDate: monthsAgo(5),
    },
    update: {},
  });
  console.log(`  Loan: ${loan.title} (${loan.id})`);

  const monthlyRate = Math.pow(1 + 0.1718, 1 / 12) - 1;
  let balance = 47_000_000;
  const paymentsToCreate = [];

  for (let i = 0; i < 8; i++) {
    const interest = balance * monthlyRate;
    let principalPaid = 1_018_463.5 - interest;
    if (principalPaid >= balance) {
      principalPaid = balance;
    }
    balance = Math.max(0, balance - principalPaid);

    paymentsToCreate.push({
      loanId: LOAN_ID,
      amount: 1_018_463.5.toFixed(2),
      principalPaid: principalPaid.toFixed(2),
      interestPaid: interest.toFixed(2),
      paidDate: monthsAgo(5 - i),
    });
  }

  for (const payment of paymentsToCreate) {
    await prisma.loanPayment.upsert({
      where: {
        id: `${EXTRA_PREFIX}pay-${LOAN_ID}-${payment.paidDate.toISOString()}`,
      },
      create: {
        ...payment,
        id: `${EXTRA_PREFIX}pay-${LOAN_ID}-${payment.paidDate.toISOString()}`,
      },
      update: {},
    });
  }
  console.log(`  Payments: 8 cuotas registradas`);

  const extras = [
    { amount: 2_000_000, monthsBack: 3, note: "Abono a capital por prima semestral" },
    { amount: 1_500_000, monthsBack: 1, note: "Abono a capital por devolución" },
  ];

  for (let i = 0; i < extras.length; i++) {
    const extra = extras[i];
    await prisma.loanExtraPayment.upsert({
      where: { id: `${EXTRA_PREFIX}extra-${LOAN_ID}-${i + 1}` },
      create: {
        id: `${EXTRA_PREFIX}extra-${LOAN_ID}-${i + 1}`,
        loanId: LOAN_ID,
        amount: extra.amount.toFixed(2),
        date: monthsAgo(extra.monthsBack),
        note: extra.note,
      },
      update: {},
    });
  }
  console.log(`  Extras: 2 abonos a capital registrados`);

  const summary = {
    simulations: await prisma.simulation.count({ where: { userId, id: { startsWith: "seed-" } } }),
    loans: await prisma.loan.count({ where: { userId, id: { startsWith: "seed-" } } }),
    payments: await prisma.loanPayment.count({ where: { loanId: LOAN_ID } }),
    extras: await prisma.loanExtraPayment.count({ where: { loanId: LOAN_ID } }),
  };
  console.log(`\nDone:`);
  console.log(`  Simulations: ${summary.simulations}`);
  console.log(`  Loans: ${summary.loans}`);
  console.log(`  Payments: ${summary.payments}`);
  console.log(`  Extras: ${summary.extras}`);
  console.log(`\nAbre http://localhost:3000/history para ver la línea de tiempo.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
