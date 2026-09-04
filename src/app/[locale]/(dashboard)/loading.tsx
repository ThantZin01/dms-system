import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-5 w-96 rounded-lg" />
      </div>
      
      <TableSkeleton />
    </div>
  );
}
