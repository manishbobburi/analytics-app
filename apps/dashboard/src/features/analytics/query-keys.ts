import type {
  OverviewQuery,
  EventTrendQuery,
  TopPagesQuery,
  TopEventsQuery,
  BreakdownQuery,
} from './types';

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

  topPages: (query: TopPagesQuery) =>
    [
      ...analyticsKeys.all,
      'top-pages',
      query.from.toISOString(),
      query.to.toISOString(),
      query.k,
    ] as const,

  topEvents: (query: TopEventsQuery) =>
    [
      ...analyticsKeys.all,
      'top-events',
      query.from.toISOString(),
      query.to.toISOString(),
      query.events_top,
    ] as const,

  breakdown: (query: BreakdownQuery) =>
    [
      ...analyticsKeys.all,
      'breakdown',
      query.from.toISOString(),
      query.to.toISOString(),
      query.dimension,
    ] as const,
};
