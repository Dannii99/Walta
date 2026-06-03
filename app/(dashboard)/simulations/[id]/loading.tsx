import { Skeleton } from "@/components/ui/skeleton";

export default function SimulationDetailLoading() {
  return (
    <div className="p-4 md:px-6 lg:px-10 py-6 md:py-8 max-w-[1440px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-32 md:col-span-2 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
      <Skeleton className="h-48 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}
