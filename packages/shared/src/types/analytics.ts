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

export { OverviewQuery, OverviewFilters, OverviewResponse };
