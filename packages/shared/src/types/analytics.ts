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

export {
  OverviewQuery,
  OverviewFilters,
  OverviewResponse,
  TrendInterval,
  EventTrendQuery,
  EventTrendPoint,
  EventTrendResponse,
};
