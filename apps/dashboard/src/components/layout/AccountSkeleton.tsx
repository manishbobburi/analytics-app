import { Skeleton } from '../ui/skeleton';

export function AccountSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

      <div className="grid flex-1 gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}
