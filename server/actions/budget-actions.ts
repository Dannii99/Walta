"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { BudgetRule, CategoryType } from "@/types";

const budgetRuleSchema = z.object({
  needs: z.number().int().min(0).max(100),
  wants: z.number().int().min(0).max(100),
  savings: z.number().int().min(0).max(100),
});

const categoryInputSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["NEEDS", "WANTS", "SAVINGS", "DEBT"] as const),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

const createBudgetSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(100),
  income: z.string().regex(/^\d+(\.\d{1,2})?$/),
  rule: budgetRuleSchema,
  categories: z.array(categoryInputSchema).optional(),
});

export async function createBudget(
  userId: string,
  name: string,
  income: string,
  rule: BudgetRule,
  categories?: { name: string; type: CategoryType; color: string }[]
) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const parsed = createBudgetSchema.parse({
    userId,
    name,
    income,
    rule,
    categories,
  });

  const budget = await prisma.budget.create({
    data: {
      userId: parsed.userId,
      name: parsed.name,
      income: parsed.income,
      currency: "COP",
      rule: parsed.rule as object,
      categories: parsed.categories
        ? {
            create: parsed.categories,
          }
        : undefined,
    },
    include: {
      categories: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/expenses");

  return {
    ...budget,
    income: budget.income.toString(),
  };
}

const updateBudgetSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  income: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  rule: budgetRuleSchema.optional(),
});

export async function updateBudget(
  budgetId: string,
  data: {
    name?: string;
    income?: string;
    rule?: BudgetRule;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    select: { userId: true },
  });

  if (!budget || budget.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const parsed = updateBudgetSchema.parse(data);

  const updated = await prisma.budget.update({
    where: { id: budgetId },
    data: {
      ...(parsed.name && { name: parsed.name }),
      ...(parsed.income && { income: parsed.income }),
      ...(parsed.rule && { rule: parsed.rule as object }),
    },
    include: {
      categories: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/expenses");

  return {
    ...updated,
    income: updated.income.toString(),
  };
}

export async function deleteBudget(budgetId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    select: { userId: true },
  });

  if (!budget || budget.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.budget.delete({
    where: { id: budgetId },
  });

  revalidatePath("/");
  revalidatePath("/expenses");

  return { success: true };
}
