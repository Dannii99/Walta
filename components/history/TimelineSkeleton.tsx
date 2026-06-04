export function TimelineSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <div className="h-10 w-10 rounded-full bg-stone-200 dark:bg-stone-800 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-1/3 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
