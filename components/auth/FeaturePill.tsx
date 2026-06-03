import { type LucideIcon } from "lucide-react";

interface FeaturePillProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export function FeaturePill({ icon: Icon, title, description, gradient }: FeaturePillProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-white/70 dark:bg-stone-900/60 backdrop-blur p-3 border border-white/80 dark:border-stone-800 shrink-0 min-w-[200px] md:min-w-0">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${gradient}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2.5} />
      </div>
      <div className="text-left min-w-0">
        <p className="text-xs font-bold text-stone-900 dark:text-stone-50 leading-tight">
          {title}
        </p>
        <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}
