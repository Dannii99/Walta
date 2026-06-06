import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const tables = await prisma.$queryRaw<Array<{ t: string }>>`
    SELECT table_name::text AS t
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name LIKE '%Loan%'
    ORDER BY table_name
  `;
  console.log("Tablas Loan:*");
  console.log(JSON.stringify(tables, null, 2));

  const fees = await prisma.loanFee.findMany();
  console.log(`\nLoanFee rows: ${fees.length}`);

  const loans = await prisma.loan.findMany({
    select: {
      id: true,
      title: true,
      monthlyPayment: true,
      _count: { select: { fees: true } },
    },
  });
  console.log("\nLoans:");
  console.log(JSON.stringify(loans, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
