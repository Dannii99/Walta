"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { invalidateLoanAdvisorCache } from "@/lib/ai/loan-advisor";
import { clearLoanInsightsCache } from "@/lib/ai/loan-insights";
import {
  createLoanSchema,
  computePaidInstallments,
} from "@/server/schemas/loan-schemas";

function revalidateCreditPaths(loanId?: string) {
  revalidatePath("/credits");
  if (loanId) {
    revalidatePath(`/credits/${loanId}`);
    revalidatePath(`/credits/${loanId}/edit`);
  }
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  return new Date(Date.UTC(year, month + months, day));
}

function generateSyncedPayments(
  loan: {
    principal: number;
    annualRate: number;
    formula: string;
    monthlyPayment: number;
    startDate: Date;
  },
  pastPaymentsSync: { month: number; year: number; status: "PAID" | "PENDING" | "DEFAULTED" }[]
) {
  const monthlyRate =
    loan.formula === "french_ea"
      ? Math.pow(1 + loan.annualRate, 1 / 12) - 1
      : loan.annualRate / 12;

  let balance = loan.principal;
  const payments = [];

  // Sort sync data by date
  const sortedSync = pastPaymentsSync
    .slice()
    .sort((a, b) => {
      const diff = a.year - b.year;
      if (diff !== 0) return diff;
      return a.month - b.month;
    });

  for (const sync of sortedSync) {
    if (sync.status !== "PAID") continue;

    const interest = balance * monthlyRate;
    let principalPaid = loan.monthlyPayment - interest;

    if (principalPaid >= balance) {
      principalPaid = balance;
    }

    balance = Math.max(0, balance - principalPaid);

    // Calculate the exact installment date (startDate + month offset based on sync date)
    const startYear = loan.startDate.getUTCFullYear();
    const startMonth = loan.startDate.getUTCMonth();
    const monthOffset = (sync.year - startYear) * 12 + (sync.month - startMonth);

    payments.push({
      amount: String(loan.monthlyPayment.toFixed(2)),
      principalPaid: String(principalPaid.toFixed(2)),
      interestPaid: String(interest.toFixed(2)),
      paidDate: addMonths(loan.startDate, monthOffset),
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
    fees?: { id: string; name: string; amount: number; type: "monthly" | "upfront" }[];
    initialExtraPayment?: number;
    pastPaymentsSync?: { month: number; year: number; status: "PAID" | "PENDING" | "DEFAULTED" }[];
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const parsed = createLoanSchema.parse({ userId, ...data });

  const startDate = parsed.startDate ? new Date(parsed.startDate) : new Date();

  // paidInstallments is always derived from the per-month toggles in
  // pastPaymentsSync. There is no way for the client to type a number.
  const paidInstallments = computePaidInstallments(parsed.pastPaymentsSync);

  // Determine if any past payment is marked as DEFAULTED
  const hasDefaulted = parsed.pastPaymentsSync.some((p) => p.status === "DEFAULTED");

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
      paidInstallments,
      fees: parsed.fees,
      status: hasDefaulted ? "DEFAULTED" : "ACTIVE",
    } as Parameters<typeof prisma.loan.create>[0]["data"],
  });

  // Generate payments from pastPaymentsSync for ongoing loans
  if (parsed.pastPaymentsSync.length > 0) {
    const syncedPayments = generateSyncedPayments(
      {
        principal: parsed.principal,
        annualRate: parsed.annualRate,
        formula: parsed.formula,
        monthlyPayment: parsed.monthlyPayment,
        startDate,
      },
      parsed.pastPaymentsSync
    );

    if (syncedPayments.length > 0) {
      await prisma.loanPayment.createMany({
        data: syncedPayments.map((p) => ({
          loanId: loan.id,
          amount: p.amount,
          principalPaid: p.principalPaid,
          interestPaid: p.interestPaid,
          paidDate: p.paidDate,
        })),
      });
    }
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

  revalidateCreditPaths(loan.id);

  const sessionUserId = (await auth())?.user?.id;
  if (sessionUserId) {
    clearLoanInsightsCache(sessionUserId);
  }

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
    totalInterest?: number;
    totalCost?: number;
    fees?: { id: string; name: string; amount: number; type: "monthly" | "upfront" }[];
    pastPaymentsSync?: { month: number; year: number; status: "PAID" | "PENDING" | "DEFAULTED" }[];
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.loan.findUnique({
    where: { id },
    select: { userId: true, startDate: true, principal: true, annualRate: true, formula: true, monthlyPayment: true },
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
  if (data.totalInterest !== undefined) updateData.totalInterest = data.totalInterest;
  if (data.totalCost !== undefined) updateData.totalCost = data.totalCost;
  if (data.fees !== undefined) updateData.fees = data.fees;

  // Handle pastPaymentsSync for update
  if (data.pastPaymentsSync && data.pastPaymentsSync.length > 0) {
    const hasDefaulted = data.pastPaymentsSync.some((p) => p.status === "DEFAULTED");
    if (hasDefaulted && data.status === undefined) {
      updateData.status = "DEFAULTED";
    }

    // Delete existing payments and recreate from sync
    await prisma.loanPayment.deleteMany({ where: { loanId: id } });

    const syncedPayments = generateSyncedPayments(
      {
        principal: data.principal ?? Number(existing.principal),
        annualRate: data.annualRate ?? Number(existing.annualRate),
        formula: data.formula ?? existing.formula,
        monthlyPayment: data.monthlyPayment ?? Number(existing.monthlyPayment),
        startDate: data.startDate ? new Date(data.startDate) : existing.startDate,
      },
      data.pastPaymentsSync
    );

    if (syncedPayments.length > 0) {
      await prisma.loanPayment.createMany({
        data: syncedPayments.map((p) => ({
          loanId: id,
          amount: p.amount,
          principalPaid: p.principalPaid,
          interestPaid: p.interestPaid,
          paidDate: p.paidDate,
        })),
      });
    }

    // paidInstallments is always derived from the per-month toggles.
    updateData.paidInstallments = computePaidInstallments(data.pastPaymentsSync);
  }

  const updated = await prisma.loan.update({
    where: { id },
    data: updateData,
  });

  revalidateCreditPaths(id);

  const sessionUserId = (await auth())?.user?.id;
  if (sessionUserId) {
    invalidateLoanAdvisorCache(sessionUserId, id);
    clearLoanInsightsCache(sessionUserId);
  }

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

  revalidateCreditPaths();

  const sessionUserId = (await auth())?.user?.id;
  if (sessionUserId) {
    invalidateLoanAdvisorCache(sessionUserId, id);
    clearLoanInsightsCache(sessionUserId);
  }

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

  // Sync paidInstallments: take the max(real count, current paidInstallments)
  // so manual syncing from the extract isn't overwritten when real payments
  // are below the extract total.
  const realPaymentCount = await prisma.loanPayment.count({
    where: { loanId: parsed.loanId },
  });
  const currentLoan = await prisma.loan.findUnique({
    where: { id: parsed.loanId },
    select: { paidInstallments: true, termMonths: true },
  });
  if (currentLoan) {
    const newPaid = Math.min(
      Math.max(currentLoan.paidInstallments, realPaymentCount),
      currentLoan.termMonths
    );
    if (newPaid !== currentLoan.paidInstallments) {
      await prisma.loan.update({
        where: { id: parsed.loanId },
        data: { paidInstallments: newPaid },
      });
    }
  }

  revalidateCreditPaths(loanId);

  const sessionUserId = session.user.id;
  invalidateLoanAdvisorCache(sessionUserId, loanId);
  clearLoanInsightsCache(sessionUserId);

  return {
    ...payment,
    amount: payment.amount.toString(),
    principalPaid: payment.principalPaid.toString(),
    interestPaid: payment.interestPaid.toString(),
  };
}

const syncPaidInstallmentsSchema = z.object({
  loanId: z.string().min(1),
  paidInstallments: z.number().int().nonnegative(),
});

export async function syncPaidInstallmentsAction(
  loanId: string,
  paidInstallments: number
): Promise<{ paidInstallments: number; termMonths: number }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const loan = await prisma.loan.findUnique({
    where: { id: loanId },
    select: { userId: true, termMonths: true, paidInstallments: true },
  });

  if (!loan || loan.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const parsed = syncPaidInstallmentsSchema.parse({ loanId, paidInstallments });

  if (parsed.paidInstallments > loan.termMonths) {
    throw new Error(
      `El número de cuotas pagadas (${parsed.paidInstallments}) no puede superar el plazo (${loan.termMonths}).`
    );
  }

  if (parsed.paidInstallments === loan.paidInstallments) {
    return { paidInstallments: loan.paidInstallments, termMonths: loan.termMonths };
  }

  await prisma.loan.update({
    where: { id: loanId },
    data: { paidInstallments: parsed.paidInstallments },
  });

  revalidateCreditPaths(loanId);

  const sessionUserId = session.user.id;
  invalidateLoanAdvisorCache(sessionUserId, loanId);
  clearLoanInsightsCache(sessionUserId);

  return { paidInstallments: parsed.paidInstallments, termMonths: loan.termMonths };
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

  revalidateCreditPaths(loanId);

  const sessionUserId = session.user.id;
  invalidateLoanAdvisorCache(sessionUserId, loanId);
  clearLoanInsightsCache(sessionUserId);

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

  // Resync paidInstallments: max(real count, current paidInstallments).
  // Deleting a real payment should not drop the count below what the extract says.
  const realPaymentCount = await prisma.loanPayment.count({
    where: { loanId: existing.loanId },
  });
  const loanAfterDelete = await prisma.loan.findUnique({
    where: { id: existing.loanId },
    select: { paidInstallments: true, termMonths: true },
  });
  if (loanAfterDelete) {
    const newPaid = Math.min(
      Math.max(loanAfterDelete.paidInstallments, realPaymentCount),
      loanAfterDelete.termMonths
    );
    if (newPaid !== loanAfterDelete.paidInstallments) {
      await prisma.loan.update({
        where: { id: existing.loanId },
        data: { paidInstallments: newPaid },
      });
    }
  }

  revalidateCreditPaths(existing.loanId);

  const sessionUserId = (await auth())?.user?.id;
  if (sessionUserId) {
    invalidateLoanAdvisorCache(sessionUserId, existing.loanId);
    clearLoanInsightsCache(sessionUserId);
  }

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

  revalidateCreditPaths(existing.loanId);

  const sessionUserId = (await auth())?.user?.id;
  if (sessionUserId) {
    invalidateLoanAdvisorCache(sessionUserId, existing.loanId);
    clearLoanInsightsCache(sessionUserId);
  }

  return { success: true };
}
