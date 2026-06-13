import { type LucideIcon } from "lucide-react";

interface TrustChipProps {
  icon: LucideIcon;
  label: string;
}

export function TrustChip({ icon: Icon, label }: TrustChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-stone-900/60 backdrop-blur border border-white/80 dark:border-stone-800 px-2.5 py-1 text-[11px] font-semibold text-stone-700 dark:text-stone-300">
      <Icon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
      {label}
    </span>
  );
}
