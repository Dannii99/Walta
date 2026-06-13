import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryLoading() {
  return (
    <div className="p-4 md:px-6 lg:px-10 pb-24 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56 bg-[#e8e8e8] dark:bg-[#2a2a2e]" />
        <Skeleton className="h-4 w-80 max-w-full bg-[#e8e8e8] dark:bg-[#2a2a2e]" />
      </div>
      <Skeleton className="h-16 w-full bg-[#e8e8e8] dark:bg-[#2a2a2e]" />
      <div className="space-y-3">
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
    </div>
  );
}
