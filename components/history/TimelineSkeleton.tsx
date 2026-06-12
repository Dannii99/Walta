export function TimelineSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-[#17181c]"
        >
          <div className="h-10 w-10 rounded-full bg-[#e8e8e8] dark:bg-[#2a2a2e] animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 w-1/3 bg-[#e8e8e8] dark:bg-[#2a2a2e] rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-[#e8e8e8] dark:bg-[#2a2a2e] rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-[#e8e8e8] dark:bg-[#2a2a2e] rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
