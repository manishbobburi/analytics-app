import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import { Skeleton } from '@/components/ui/skeleton';
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

import { useTopEvents } from '../hooks';
import type { TopEventsPreset } from '../types';
import { TOP_EVENTS_LABELS } from '../top-events';

const chartConfig = {
  count: {
    label: 'Events',
    color: 'var(--foreground)',
  },
} satisfies ChartConfig;

export function TopEvents() {
  const { data, isPending, isError, refetch, events_top, setTopEventsParams } = useTopEvents();

  if (isPending) {
    return <TopEventsSkeleton />;
  }

  if (isError) {
    return (
      <QueryError
        title="Unable to load top events"
        description="We couldn't load your dashboard metrics."
        onRetry={refetch}
      />
    );
  }

  const chartData = data.topEvents;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Top Events</CardTitle>
          <CardDescription>Total events {data.totalEvents}</CardDescription>
        </div>

        <TopKSelect value={events_top} onChange={setTopEventsParams} />
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-65 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              top: 8,
              right: 48,
              left: 8,
              bottom: 8,
            }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />

            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.toLocaleString()}
            />

            <YAxis
              type="category"
              dataKey="event"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={80}
              tick={{ fontSize: 12 }}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />

            <Bar dataKey="count" fill="var(--color-count)" radius={[0, 6, 6, 0]} barSize={28}>
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                formatter={(value) => Number(value).toLocaleString()}
                fill="var(--foreground)"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

interface TopKSelectProps {
  value: TopEventsPreset;
  onChange: (value: TopEventsPreset) => void;
}

function TopKSelect({ value, onChange }: TopKSelectProps) {
  const items = Object.entries(TOP_EVENTS_LABELS).map(([value, label]) => ({
    value: value as TopEventsPreset,
    label,
  }));
  return (
    <Select
      value={value}
      onValueChange={(value) => {
        onChange(value as TopEventsPreset);
      }}
      items={items}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>

      <SelectContent alignItemWithTrigger={false}>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TopEventsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>

        <Skeleton className="h-9 w-20" />
      </CardHeader>

      <CardContent>
        <div className="h-65 space-y-4 pt-4">
          {[72, 100, 84, 58, 76].map((width, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-4 w-16 shrink-0" />

              <Skeleton className="h-7" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
