"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const createTransactionSchema = z.object({
  categoryId: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().max(500).nullable().optional(),
  date: z.union([z.date(), z.string().datetime()]),
});

export async function createTransaction(
  categoryId: string,
  amount: number,
  description?: string | null,
  date: Date | string = new Date()
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      budget: { select: { userId: true } },
    },
  });

  if (!category || category.budget.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const parsed = createTransactionSchema.parse({
    categoryId,
    amount,
    description,
    date,
  });

  const transaction = await prisma.transaction.create({
    data: {
      categoryId: parsed.categoryId,
      amount: parsed.amount,
      description: parsed.description,
      date: parsed.date,
    },
  });

  revalidatePath("/");
  revalidatePath("/transactions");

  return {
    ...transaction,
    amount: transaction.amount.toString(),
  };
}

const updateTransactionSchema = z.object({
  categoryId: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  description: z.string().max(500).nullable().optional(),
  date: z.union([z.date(), z.string().datetime()]).optional(),
});

export async function updateTransaction(
  id: string,
  data: {
    categoryId?: string;
    amount?: number;
    description?: string | null;
    date?: Date | string;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.transaction.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          budget: { select: { userId: true } },
        },
      },
    },
  });

  if (!existing || existing.category.budget.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const parsed = updateTransactionSchema.parse(data);

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      ...(parsed.categoryId && { categoryId: parsed.categoryId }),
      ...(parsed.amount !== undefined && { amount: parsed.amount }),
      ...(parsed.description !== undefined && {
        description: parsed.description,
      }),
      ...(parsed.date && { date: parsed.date }),
    },
  });

  revalidatePath("/");
  revalidatePath("/transactions");

  return {
    ...updated,
    amount: updated.amount.toString(),
  };
}

export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.transaction.findUnique({
    where: { id },
    include: {
      category: {
        include: {
          budget: { select: { userId: true } },
        },
      },
    },
  });

  if (!existing || existing.category.budget.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.transaction.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/transactions");

  return { success: true };
}
