import type { OverviewQuery, EventTrendQuery } from './types';

export const analyticsKeys = {
  all: ['analytics'] as const,

  overview: (query: OverviewQuery) =>
    [...analyticsKeys.all, 'overview', query.from.toISOString(), query.to.toISOString()] as const,

  eventTrend: (query: EventTrendQuery) =>
    [
      ...analyticsKeys.all,
      'event-trend',
      query.from.toISOString(),
      query.to.toISOString(),
      query.interval,
    ] as const,
};
