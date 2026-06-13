"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserSimulations(userId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const simulations = await prisma.simulation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return simulations;
}

export async function getSimulationById(simulationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationId },
  });

  if (!simulation || simulation.userId !== session.user.id) {
    return null;
  }

  return simulation;
}

export interface SimulationStats {
  total: number;
  sumMonthlyPayments: number;
  viableCount: number;
  riskyCount: number;
}

export async function getSimulationStats(userId: string): Promise<SimulationStats> {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const simulations = await prisma.simulation.findMany({
    where: { userId },
    select: { result: true },
  });

  let sumMonthlyPayments = 0;
  let viableCount = 0;
  let riskyCount = 0;

  for (const sim of simulations) {
    const result = sim.result as { monthlyPayment?: number; verdict?: string } | null;
    const payment = Number(result?.monthlyPayment ?? 0);
    sumMonthlyPayments += payment;
    if (result?.verdict === "APPROVED") viableCount++;
    if (result?.verdict === "REJECTED") riskyCount++;
  }

  return {
    total: simulations.length,
    sumMonthlyPayments,
    viableCount,
    riskyCount,
  };
}
