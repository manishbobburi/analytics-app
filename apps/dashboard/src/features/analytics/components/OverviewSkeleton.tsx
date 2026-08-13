import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SKELETON_COUNT = 4;

export function OverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
          </CardHeader>

          <CardContent>
            <Skeleton className="h-8 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
