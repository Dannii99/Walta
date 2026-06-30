"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PREDEFINED_CATEGORIES } from "@/lib/categories";
import type { BudgetRule, CategoryType } from "@/types";

const TYPE_COLORS: Record<CategoryType, string> = {
  NEEDS: "#26be15",
  WANTS: "#e7964d",
  SAVINGS: "#617dd5",
  DEBT: "#9333ea",
};

const budgetRuleSchema = z.object({
  needs: z.number().int().min(0).max(100),
  wants: z.number().int().min(0).max(100),
  savings: z.number().int().min(0).max(100),
});

const decimalString = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/)
  .nullish();

const categoryInputSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["NEEDS", "WANTS", "SAVINGS", "DEBT"] as const),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  icon: z.string().max(50).nullish(),
  description: z.string().max(200).nullish(),
  plannedAmount: decimalString,
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
  categories?: { name: string; type: CategoryType; color: string; icon?: string; description?: string; plannedAmount?: string | null }[]
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

  const finalCategories =
    parsed.categories && parsed.categories.length > 0
      ? parsed.categories
      : PREDEFINED_CATEGORIES.map((c) => ({
          name: c.name,
          type: c.type,
          color: TYPE_COLORS[c.type],
          icon: c.icon,
          description: c.description,
          plannedAmount: null,
        }));

  const budget = await prisma.budget.create({
    data: {
      userId: parsed.userId,
      name: parsed.name,
      income: parsed.income,
      currency: "COP",
      rule: parsed.rule as object,
      categories: {
        create: finalCategories,
      },
    },
    include: {
      categories: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/expenses");
  revalidatePath("/reglas");

  return {
    ...budget,
    income: budget.income.toString(),
    categories: budget.categories.map((c) => ({
      ...c,
      plannedAmount: c.plannedAmount ? c.plannedAmount.toString() : null,
    })),
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
  revalidatePath("/reglas");

  return {
    ...updated,
    income: updated.income.toString(),
    categories: updated.categories.map((c) => ({
      ...c,
      plannedAmount: c.plannedAmount ? c.plannedAmount.toString() : null,
    })),
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
  revalidatePath("/reglas");

  return { success: true };
}
