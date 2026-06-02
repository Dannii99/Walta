import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 space-y-6 md:space-y-8 max-w-[1440px] mx-auto">
      <div className="space-y-3">
        <Skeleton className="h-3 w-48 rounded" />
        <Skeleton className="h-10 w-72 rounded" />
        <Skeleton className="h-4 w-full max-w-md rounded" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-9 w-32 rounded" />
          <Skeleton className="h-9 w-44 rounded" />
        </div>
      </div>

      <Skeleton className="h-44 md:h-52 w-full rounded-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-5 md:gap-6">
        <Skeleton className="h-80 xl:col-span-3 rounded-2xl" />
        <Skeleton className="h-80 xl:col-span-2 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
      </div>

      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  );
}
