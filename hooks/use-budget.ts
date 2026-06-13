"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserBudgets } from "@/server/queries/budget-queries";

export function useBudget(userId: string) {
  return useQuery({
    queryKey: ["budgets", userId],
    queryFn: () => getUserBudgets(userId),
    enabled: !!userId,
    select: (budgets) => budgets[0] ?? null,
  });
}
