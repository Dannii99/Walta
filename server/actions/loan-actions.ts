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
});

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
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const parsed = createLoanSchema.parse({ userId, ...data });

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
      startDate: parsed.startDate ? new Date(parsed.startDate) : new Date(),
      totalInterest: parsed.totalInterest,
      totalCost: parsed.totalCost,
    },
  });

  revalidatePath("/credits");

  return {
    ...loan,
    principal: loan.principal.toString(),
    downPayment: loan.downPayment.toString(),
    annualRate: loan.annualRate.toString(),
    monthlyPayment: loan.monthlyPayment.toString(),
    totalInterest: loan.totalInterest.toString(),
    totalCost: loan.totalCost.toString(),
  };
}

export async function updateLoan(
  id: string,
  data: {
    title?: string;
    status?: "ACTIVE" | "PAID_OFF" | "DEFAULTED";
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

  const updated = await prisma.loan.update({
    where: { id },
    data,
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
