"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserSimulations } from "@/server/queries/simulation-queries";

export function useSimulations(userId: string) {
  return useQuery({
    queryKey: ["simulations", userId],
    queryFn: () => getUserSimulations(userId),
    enabled: !!userId,
  });
}
