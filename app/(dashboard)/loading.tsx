import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-4 md:p-8 space-y-5 md:space-y-6 max-w-7xl mx-auto">
      <Skeleton className="h-48 md:h-56 w-full rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 md:gap-6">
        <Skeleton className="h-80 xl:col-span-2 rounded-2xl" />
        <Skeleton className="h-80 xl:col-span-1 rounded-2xl" />
      </div>
    </div>
  );
}
