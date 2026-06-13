"use client";

import { cn } from "@/lib/utils";

export function DashedLine() {
  return (
    <div className="relative h-px my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-dashed border-[#e8e8e8] dark:border-[#2a2a2e]" />
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-wider text-[#737373] dark:text-[#a1a1aa] mb-2">
      {children}
    </p>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5">
      <span className="text-sm text-[#737373] dark:text-[#a1a1aa] font-medium">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-[#17181c] dark:text-white">
        {value}
      </span>
    </div>
  );
}

export function HighlightRow({ label, value, color }: { label: string; value: string; color?: "green" | "red" }) {
  const bg = color === "red" ? "bg-[#e54d4d]/5 dark:bg-[#e54d4d]/10" : "bg-[#26be15]/5 dark:bg-[#26be15]/10";
  const text = color === "red" ? "text-[#e54d4d]" : "text-[#26be15]";
  return (
    <div className={cn("flex items-baseline justify-between gap-2 py-2 px-2.5 rounded-lg", bg)}>
      <span className="text-sm font-semibold text-[#17181c] dark:text-white">{label}</span>
      <span className={cn("text-sm font-bold tabular-nums", text)}>{value}</span>
    </div>
  );
}

export function HeroRow({ label, value, color }: { label: string; value: string; color?: "green" | "red" }) {
  const bg = color === "red" ? "bg-[#e54d4d]/5 dark:bg-[#e54d4d]/10" : "bg-[#26be15]/5 dark:bg-[#26be15]/10";
  const text = color === "red" ? "text-[#e54d4d]" : "text-[#26be15]";
  return (
    <div className={cn("flex items-baseline justify-between gap-2 py-3 px-3 rounded-lg", bg)}>
      <span className="text-sm font-semibold text-[#17181c] dark:text-white">{label}</span>
      <span className={cn("text-base font-bold tabular-nums", text)}>{value}</span>
    </div>
  );
}

export function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1.5">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#e54d4d]" />
        <span className="text-sm text-[#737373] dark:text-[#a1a1aa] font-medium">{label}</span>
      </div>
      <span className="text-sm font-semibold tabular-nums text-[#e54d4d]">{value}</span>
    </div>
  );
}

export function FeeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1">
      <span className="text-sm text-[#737373] dark:text-[#a1a1aa] font-medium">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-[#617dd5]">{value}</span>
    </div>
  );
}
