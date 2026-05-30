import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-64" />
    </div>
  );
}
