import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-4 md:px-6 lg:px-10 pb-24 md:pb-6 pt-6 md:pt-8 max-w-360 mx-auto">
      <div className="space-y-6 md:space-y-8 max-w-3xl">
        <div className="space-y-2">
          <Skeleton className="h-4 w-48 bg-[#e8e8e8] dark:bg-[#2a2a2e]" />
          <Skeleton className="h-10 w-64 bg-[#e8e8e8] dark:bg-[#2a2a2e]" />
          <Skeleton className="h-4 w-80 bg-[#e8e8e8] dark:bg-[#2a2a2e]" />
        </div>
        <div className="bg-[#e8e8e8] dark:bg-[#2a2a2e] rounded-2xl p-5 md:p-6 space-y-5">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32 bg-[#f5f5f5] dark:bg-white/5" />
              <Skeleton className="h-3 w-56 bg-[#f5f5f5] dark:bg-white/5" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Skeleton className="h-28 rounded-xl bg-[#f5f5f5] dark:bg-white/5" />
            <Skeleton className="h-28 rounded-xl bg-[#f5f5f5] dark:bg-white/5" />
            <Skeleton className="h-28 rounded-xl bg-[#f5f5f5] dark:bg-white/5" />
          </div>
        </div>
        <div className="bg-[#e8e8e8] dark:bg-[#2a2a2e] rounded-2xl p-5 md:p-6 space-y-5">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-lg bg-[#f5f5f5] dark:bg-white/5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32 bg-[#f5f5f5] dark:bg-white/5" />
              <Skeleton className="h-3 w-56 bg-[#f5f5f5] dark:bg-white/5" />
            </div>
          </div>
          <Skeleton className="h-20 rounded-xl bg-[#f5f5f5] dark:bg-white/5" />
          <Skeleton className="h-10 w-32 rounded-full bg-[#f5f5f5] dark:bg-white/5" />
        </div>
      </div>
    </div>
  );
}
