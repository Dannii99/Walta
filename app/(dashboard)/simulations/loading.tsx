import { Skeleton } from "@/components/ui/skeleton";

export default function SimulationsLoading() {
  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-16 rounded-2xl" />
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
