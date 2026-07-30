interface OverviewQuery {
  from?: Date;
  to?: Date;
}

interface OverviewFilters {
  orgId: string;
  from?: Date;
  to?: Date;
}

interface OverviewResponse {
  totalEvents: number;
  uniqueUsers: number;
  anonymousUsers: number;
  sessions: number;
}

type TrendInterval = 'hour' | 'day' | 'week' | 'month';

interface EventTrendQuery {
  orgId: string;
  from: Date;
  to: Date;
  interval: TrendInterval;
}

interface EventTrendPoint {
  period: string;
  events: number;
}

type EventTrendResponse = EventTrendPoint[];

type BreakdownDimension = 'device' | 'browser' | 'os' | 'referrer' | 'language';

interface BreakdownQuery {
  orgId: string;
  from: Date;
  to: Date;
  dimension: BreakdownDimension;
}

interface BreakdownRecord {
  label: string;
  count: number;
}

type BreakdownResponse = BreakdownRecord[];

interface TopEventsQuery {
  orgId: string;
  from?: Date;
  to?: Date;
  k: number;
}

interface TopEvent {
  event: string;
  count: number;
  percentage: number;
}

interface TopEventsResponse {
  totalEvents: number;
  topEvents: TopEvent[];
}

interface TopEventRecord {
  event: string;
  count: bigint;
}

export {
  OverviewQuery,
  OverviewFilters,
  OverviewResponse,
  TrendInterval,
  EventTrendQuery,
  EventTrendPoint,
  EventTrendResponse,
  BreakdownDimension,
  BreakdownQuery,
  BreakdownRecord,
  BreakdownResponse,
  TopEventsQuery,
  TopEvent,
  TopEventRecord,
  TopEventsResponse,
};
