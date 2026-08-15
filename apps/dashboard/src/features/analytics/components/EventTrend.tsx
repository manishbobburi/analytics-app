import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { QueryError } from '@/components/common/QueryError';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { EVENT_TREND_INTERVAL_LABELS, formatDateRangeDescription } from '../event-trend';
import { useEventTrend, useDashboardDateRange } from '../hooks';
import { EventTrendSkeleton } from './EventTrendSkeleton';
import type { EventTrendInterval } from '../types';

const chartConfig = {
  events: {
    label: 'Events',
    color: 'var(--foreground)',
  },
} satisfies ChartConfig;

export function EventTrend() {
  const { data, isPending, isError, refetch, interval, setInterval } = useEventTrend();
  const { resolvedDateRange } = useDashboardDateRange();
  if (isPending) {
    return <EventTrendSkeleton />;
  }

  if (isError) {
    return (
      <QueryError
        title="Unable to load event trend"
        description="We couldn't load your dashboard metrics."
        onRetry={refetch}
      />
    );
  }

  const chartData = data;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Event Trend</CardTitle>
          <CardDescription>
            {formatDateRangeDescription(resolvedDateRange.from, resolvedDateRange.to)}
          </CardDescription>
        </div>
        <IntervalSelect value={interval} onChange={setInterval} />
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 12,
              right: 12,
              left: 12,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="eventTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-events)" stopOpacity={0.2} />

                <stop offset="100%" stopColor="var(--color-events)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatXAxisValue(new Date(value), interval)}
            />

            <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const period = payload?.[0]?.payload?.period;
                    if (typeof period !== 'string') return '';
                    return formatTooltipValue(new Date(period), interval);
                  }}
                />
              }
            />

            <Area
              dataKey="events"
              type="monotone"
              stroke="var(--color-events)"
              strokeWidth={2}
              fill="url(#eventTrendGradient)"
              dot={false}
              activeDot={{
                r: 4,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface IntervalSelectProps {
  value: EventTrendInterval;
  onChange: (value: EventTrendInterval) => void;
}

function IntervalSelect({ value, onChange }: IntervalSelectProps) {
  return (
    <Select
      value={value[0].toUpperCase() + value.slice(1)}
      onValueChange={(value) => {
        onChange(value as EventTrendInterval);
      }}
    >
      <SelectTrigger className="w-27.5">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {(Object.entries(EVENT_TREND_INTERVAL_LABELS) as [EventTrendInterval, string][]).map(
          ([key, label]) => (
            <SelectItem key={key} value={key}>
              {label}
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  );
}

function formatXAxisValue(value: Date, interval: EventTrendInterval): string {
  switch (interval) {
    case 'hour':
      return format(value, 'ha');

    case 'day':
      return format(value, 'MMM d');

    case 'week':
      return format(value, 'MMM d');

    default:
      return '';
  }
}

function formatTooltipValue(value: Date, interval: EventTrendInterval): string {
  switch (interval) {
    case 'hour':
      return format(value, 'MMM d, yyyy · h:mm a');

    case 'day':
      return format(value, 'MMM d, yyyy');

    case 'week':
      return `Week of ${format(value, 'MMM d, yyyy')}`;

    default:
      return '';
  }
}
