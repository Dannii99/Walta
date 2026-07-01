export const CATEGORY_COLORS: Record<string, string> = {
  NEEDS: "#e11d48",
  WANTS: "#10b981",
  SAVINGS: "#8b5cf6",
  DEBT: "#9333ea",
} as const;

export const CATEGORY_BG: Record<string, string> = {
  NEEDS: "bg-[var(--color-needs)]/10 text-[var(--color-needs)] border-[var(--color-needs)]/20",
  WANTS: "bg-[var(--color-wants)]/10 text-[var(--color-wants)] border-[var(--color-wants)]/20",
  SAVINGS: "bg-[var(--color-savings)]/10 text-[var(--color-savings)] border-[var(--color-savings)]/20",
  DEBT: "bg-[var(--color-debt)]/10 text-[var(--color-debt)] border-[var(--color-debt)]/20",
} as const;
