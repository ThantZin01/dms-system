import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="rounded-2xl bg-white/50 dark:bg-black/20 p-1">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse min-w-[700px]">
          <thead>
            <tr>
              <th className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50"><Skeleton className="h-4 w-24" /></th>
              <th className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50"><Skeleton className="h-4 w-32" /></th>
              <th className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50"><Skeleton className="h-4 w-20" /></th>
              <th className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-800/50"><Skeleton className="h-4 w-16" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-800/50">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                <td className="px-6 py-4"><Skeleton className="h-5 w-48" /></td>
                <td className="px-6 py-4"><Skeleton className="h-5 w-24 rounded-full" /></td>
                <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
