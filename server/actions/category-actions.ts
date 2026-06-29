"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const categoryInputSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["NEEDS", "WANTS", "SAVINGS", "DEBT"]),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#3B82F6"),
  icon: z.string().max(50).nullish(),
  description: z.string().max(200).nullish(),
});

const categoryUpdateSchema = categoryInputSchema.partial();

async function verifyCategoryOwnership(categoryId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { budget: { select: { userId: true, id: true } } },
  });

  if (!category || category.budget.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  return { category, userId: session.user.id };
}

export async function createCategory(
  budgetId: string,
  data: { name: string; type: "NEEDS" | "WANTS" | "SAVINGS" | "DEBT"; color?: string; icon?: string; description?: string }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const budget = await prisma.budget.findUnique({
    where: { id: budgetId },
    select: {
      userId: true,
      categories: { select: { name: true } },
    },
  });

  if (!budget || budget.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const parsed = categoryInputSchema.parse({
    ...data,
    color: data.color ?? "#3B82F6",
  });

  const duplicate = budget.categories.find(
    (c) => c.name.toLowerCase() === parsed.name.toLowerCase()
  );
  if (duplicate) {
    throw new Error("Ya existe una categoría con ese nombre");
  }

  const created = await prisma.category.create({
    data: {
      budgetId,
      name: parsed.name,
      type: parsed.type,
      color: parsed.color,
      icon: parsed.icon ?? null,
      description: parsed.description ?? null,
    },
  });

  revalidatePath("/reglas");
  revalidatePath("/expenses");
  revalidatePath("/dashboard");

  return created;
}

export async function updateCategory(
  categoryId: string,
  data: { name?: string; type?: "NEEDS" | "WANTS" | "SAVINGS" | "DEBT"; color?: string; icon?: string; description?: string }
) {
  const { category } = await verifyCategoryOwnership(categoryId);
  const parsed = categoryUpdateSchema.parse(data);

  if (parsed.name && parsed.name.toLowerCase() !== category.name.toLowerCase()) {
    const siblings = await prisma.category.findMany({
      where: { budgetId: category.budgetId, NOT: { id: categoryId } },
      select: { name: true },
    });
    const duplicate = siblings.find(
      (c) => c.name.toLowerCase() === parsed.name!.toLowerCase()
    );
    if (duplicate) {
      throw new Error("Ya existe una categoría con ese nombre");
    }
  }

  const updated = await prisma.category.update({
    where: { id: categoryId },
    data: parsed,
  });

  revalidatePath("/reglas");
  revalidatePath("/expenses");
  revalidatePath("/dashboard");

  return updated;
}

export async function deleteCategory(
  categoryId: string,
  reassignToCategoryId?: string
) {
  const { category } = await verifyCategoryOwnership(categoryId);

  const txCount = await prisma.transaction.count({
    where: { categoryId },
  });

  if (txCount > 0) {
    if (!reassignToCategoryId) {
      throw new Error(
        `Esta categoría tiene ${txCount} gastos. Debes reasignarlos antes de eliminar.`
      );
    }

    if (reassignToCategoryId === categoryId) {
      throw new Error("La categoría de destino no puede ser la misma");
    }

    const target = await prisma.category.findUnique({
      where: { id: reassignToCategoryId },
      include: { budget: { select: { userId: true } } },
    });

    if (
      !target ||
      target.budgetId !== category.budgetId ||
      target.budget.userId !== (await auth())?.user?.id
    ) {
      throw new Error("Categoría de destino inválida");
    }

    await prisma.transaction.updateMany({
      where: { categoryId },
      data: { categoryId: reassignToCategoryId },
    });
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  revalidatePath("/reglas");
  revalidatePath("/expenses");
  revalidatePath("/dashboard");

  return { success: true };
}
