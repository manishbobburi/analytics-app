import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QueryError } from '@/components/common/QueryError';

import { OverviewSkeleton } from './OverviewSkeleton';
import { useOverview } from '../hooks';

export function Overview() {
  const { data, isPending, isError, refetch } = useOverview();

  if (isPending) {
    return <OverviewSkeleton />;
  }

  if (isError) {
    return (
      <QueryError
        title="Unable to load overview"
        description="We couldn't load your dashboard metrics."
        onRetry={refetch}
      />
    );
  }

  const metrics = [
    {
      label: 'Total Events',
      value: data.totalEvents,
    },
    {
      label: 'Users',
      value: data.uniqueUsers,
    },
    {
      label: 'Anonymous Users',
      value: data.anonymousUsers,
    },
    {
      label: 'Sessions',
      value: data.sessions,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">{metric.value.toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
