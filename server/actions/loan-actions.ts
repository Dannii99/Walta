"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const createLoanSchema = z.object({
  userId: z.string().min(1),
  simulationId: z.string().optional(),
  title: z.string().min(1).max(200),
  type: z.enum(["VEHICLE", "PERSONAL", "HOUSING", "OTHER"] as const),
  principal: z.number().positive(),
  downPayment: z.number().nonnegative().default(0),
  annualRate: z.number().min(0).max(2),
  termMonths: z.number().int().min(1).max(120),
  formula: z.enum(["french_ea", "nominal_monthly"] as const),
  monthlyPayment: z.number().positive(),
  startDate: z.union([z.date(), z.string().datetime()]).optional(),
  totalInterest: z.number().nonnegative(),
  totalCost: z.number().positive(),
  paidInstallments: z.number().int().min(0).max(120).default(0),
  fees: z.array(z.object({
    id: z.string(),
    name: z.string(),
    amount: z.number().nonnegative(),
    type: z.enum(["monthly", "upfront"]),
  })).default([]),
  initialExtraPayment: z.number().nonnegative().optional(),
});

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  return new Date(Date.UTC(year, month + months, day));
}

function generateFictitiousPayments(
  loan: {
    principal: number;
    annualRate: number;
    formula: string;
    monthlyPayment: number;
    startDate: Date;
    paidInstallments: number;
  }
) {
  const monthlyRate =
    loan.formula === "french_ea"
      ? Math.pow(1 + loan.annualRate, 1 / 12) - 1
      : loan.annualRate / 12;

  let balance = loan.principal;
  const payments = [];

  for (let i = 0; i < loan.paidInstallments; i++) {
    const interest = balance * monthlyRate;
    let principalPaid = loan.monthlyPayment - interest;

    if (principalPaid >= balance) {
      principalPaid = balance;
    }

    balance = Math.max(0, balance - principalPaid);

    payments.push({
      amount: String(loan.monthlyPayment.toFixed(2)),
      principalPaid: String(principalPaid.toFixed(2)),
      interestPaid: String(interest.toFixed(2)),
      paidDate: addMonths(loan.startDate, i),
    });

    if (balance <= 0.01) break;
  }

  return payments;
}

export async function createLoan(
  data: {
    simulationId?: string;
    title: string;
    type: string;
    principal: number;
    downPayment?: number;
    annualRate: number;
    termMonths: number;
    formula: string;
    monthlyPayment: number;
    startDate?: Date | string;
    totalInterest: number;
    totalCost: number;
    paidInstallments?: number;
  fees?: { id: string; name: string; amount: number; type: "monthly" | "upfront" }[];
    initialExtraPayment?: number;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const parsed = createLoanSchema.parse({ userId, ...data });

  const startDate = parsed.startDate ? new Date(parsed.startDate) : new Date();

  const loan = await prisma.loan.create({
    data: {
      userId: parsed.userId,
      simulationId: parsed.simulationId ?? null,
      title: parsed.title,
      type: parsed.type,
      principal: parsed.principal,
      downPayment: parsed.downPayment ?? 0,
      annualRate: parsed.annualRate,
      termMonths: parsed.termMonths,
      formula: parsed.formula,
      monthlyPayment: parsed.monthlyPayment,
      startDate,
      totalInterest: parsed.totalInterest,
      totalCost: parsed.totalCost,
      paidInstallments: parsed.paidInstallments,
      fees: parsed.fees,
    } as Parameters<typeof prisma.loan.create>[0]["data"],
  });

  // Generate fictitious payments for ongoing loans
  if (parsed.paidInstallments > 0) {
    const fictitiousPayments = generateFictitiousPayments({
      principal: parsed.principal,
      annualRate: parsed.annualRate,
      formula: parsed.formula,
      monthlyPayment: parsed.monthlyPayment,
      startDate,
      paidInstallments: parsed.paidInstallments,
    });

    await prisma.loanPayment.createMany({
      data: fictitiousPayments.map((p) => ({
        loanId: loan.id,
        amount: p.amount,
        principalPaid: p.principalPaid,
        interestPaid: p.interestPaid,
        paidDate: p.paidDate,
      })),
    });
  }

  // Create initial extra payment if provided
  if (parsed.initialExtraPayment && parsed.initialExtraPayment > 0) {
    await prisma.loanExtraPayment.create({
      data: {
        loanId: loan.id,
        amount: String(parsed.initialExtraPayment.toFixed(2)),
        date: startDate,
        note: "Abono a capital previo al registro",
      },
    });
  }

  revalidatePath("/credits");

  return {
    ...loan,
    principal: loan.principal.toString(),
    downPayment: loan.downPayment.toString(),
    annualRate: loan.annualRate.toString(),
    monthlyPayment: loan.monthlyPayment.toString(),
    totalInterest: loan.totalInterest.toString(),
    totalCost: loan.totalCost.toString(),
    paidInstallments: (loan as unknown as { paidInstallments?: number }).paidInstallments ?? 0,
    fees: (loan as unknown as { fees?: unknown }).fees ?? [],
  };
}

export async function updateLoan(
  id: string,
  data: {
    title?: string;
    type?: string;
    principal?: number;
    downPayment?: number;
    annualRate?: number;
    termMonths?: number;
    formula?: string;
    monthlyPayment?: number;
    startDate?: Date | string;
    status?: "ACTIVE" | "PAID_OFF" | "DEFAULTED";
    paidInstallments?: number;
    totalInterest?: number;
    totalCost?: number;
    fees?: { id: string; name: string; amount: number; type: "monthly" | "upfront" }[];
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.loan.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.principal !== undefined) updateData.principal = data.principal;
  if (data.downPayment !== undefined) updateData.downPayment = data.downPayment;
  if (data.annualRate !== undefined) updateData.annualRate = data.annualRate;
  if (data.termMonths !== undefined) updateData.termMonths = data.termMonths;
  if (data.formula !== undefined) updateData.formula = data.formula;
  if (data.monthlyPayment !== undefined) updateData.monthlyPayment = data.monthlyPayment;
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
  if (data.status !== undefined) updateData.status = data.status;
  if (data.paidInstallments !== undefined) updateData.paidInstallments = data.paidInstallments;
  if (data.totalInterest !== undefined) updateData.totalInterest = data.totalInterest;
  if (data.totalCost !== undefined) updateData.totalCost = data.totalCost;
  if (data.fees !== undefined) updateData.fees = data.fees;

  const updated = await prisma.loan.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/credits");
  revalidatePath(`/credits/${id}`);

  return {
    ...updated,
    principal: updated.principal.toString(),
    downPayment: updated.downPayment.toString(),
    annualRate: updated.annualRate.toString(),
    monthlyPayment: updated.monthlyPayment.toString(),
    totalInterest: updated.totalInterest.toString(),
    totalCost: updated.totalCost.toString(),
    paidInstallments: (updated as unknown as { paidInstallments?: number }).paidInstallments ?? 0,
    fees: (updated as unknown as { fees?: unknown }).fees ?? [],
  };
}

export async function deleteLoan(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.loan.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!existing || existing.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.loan.delete({ where: { id } });

  revalidatePath("/credits");

  return { success: true };
}

const recordPaymentSchema = z.object({
  loanId: z.string().min(1),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  principalPaid: z.string().regex(/^\d+(\.\d{1,2})?$/),
  interestPaid: z.string().regex(/^\d+(\.\d{1,2})?$/),
  paidDate: z.union([z.date(), z.string().datetime()]),
});

export async function recordPayment(
  loanId: string,
  data: {
    amount: string;
    principalPaid: string;
    interestPaid: string;
    paidDate: Date | string;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    select: { userId: true },
  });

  if (!loan || loan.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const parsed = recordPaymentSchema.parse({ loanId, ...data });

  const payment = await prisma.loanPayment.create({
    data: {
      loanId: parsed.loanId,
      amount: parsed.amount,
      principalPaid: parsed.principalPaid,
      interestPaid: parsed.interestPaid,
      paidDate: new Date(parsed.paidDate),
    },
  });

  revalidatePath("/credits");
  revalidatePath(`/credits/${loanId}`);

  return {
    ...payment,
    amount: payment.amount.toString(),
    principalPaid: payment.principalPaid.toString(),
    interestPaid: payment.interestPaid.toString(),
  };
}

const recordExtraSchema = z.object({
  loanId: z.string().min(1),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  date: z.union([z.date(), z.string().datetime()]),
  note: z.string().max(500).nullable().optional(),
});

export async function recordCapitalContribution(
  loanId: string,
  data: {
    amount: string;
    date: Date | string;
    note?: string | null;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    select: { userId: true },
  });

  if (!loan || loan.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const parsed = recordExtraSchema.parse({ loanId, ...data });

  const extra = await prisma.loanExtraPayment.create({
    data: {
      loanId: parsed.loanId,
      amount: parsed.amount,
      date: new Date(parsed.date),
      note: parsed.note ?? null,
    },
  });

  revalidatePath("/credits");
  revalidatePath(`/credits/${loanId}`);

  return {
    ...extra,
    amount: extra.amount.toString(),
  };
}

export async function deletePayment(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.loanPayment.findUnique({
    where: { id },
    include: { loan: { select: { userId: true } } },
  });

  if (!existing || existing.loan.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.loanPayment.delete({ where: { id } });

  revalidatePath("/credits");
  revalidatePath(`/credits/${existing.loanId}`);

  return { success: true };
}

export async function deleteExtraPayment(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.loanExtraPayment.findUnique({
    where: { id },
    include: { loan: { select: { userId: true } } },
  });

  if (!existing || existing.loan.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.loanExtraPayment.delete({ where: { id } });

  revalidatePath("/credits");
  revalidatePath(`/credits/${existing.loanId}`);

  return { success: true };
}
