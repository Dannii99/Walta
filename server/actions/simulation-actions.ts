"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { SimulationType, SimulationInputs, SimulationResult } from "@/types";

const simulationInputsSchema = z.object({
  price: z.number().positive(),
  downPayment: z.number().nonnegative(),
  term: z.number().int().positive().max(120),
  rate: z.number().positive(),
  formula: z.string().optional(),
});

const simulationResultSchema = z.object({
  monthlyPayment: z.number().positive(),
  verdict: z.enum(["APPROVED", "WARNING", "REJECTED"] as const),
  availableAfter: z.number(),
  totalInterest: z.number().nonnegative(),
  totalCost: z.number().positive(),
});

const createSimulationSchema = z.object({
  userId: z.string().min(1),
  type: z.enum(["VEHICLE", "PERSONAL", "HOUSING", "OTHER"] as const),
  title: z.string().min(1).max(200),
  inputs: simulationInputsSchema,
  result: simulationResultSchema,
});

export async function createSimulation(
  type: SimulationType,
  title: string,
  inputs: SimulationInputs,
  result: SimulationResult
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const parsed = createSimulationSchema.parse({
    userId,
    type,
    title,
    inputs,
    result,
  });

  const simulation = await prisma.simulation.create({
    data: {
      userId: parsed.userId,
      type: parsed.type,
      title: parsed.title,
      inputs: parsed.inputs as object,
      result: parsed.result as object,
    },
  });

  revalidatePath("/");
  revalidatePath("/simulations");

  return simulation;
}

export async function deleteSimulation(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const simulation = await prisma.simulation.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!simulation || simulation.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.simulation.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/simulations");

  return { success: true };
}
