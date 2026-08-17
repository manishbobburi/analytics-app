import { api } from '@/lib/api';
import type {
  OverviewQuery,
  OverviewResponse,
  EventTrendQuery,
  EventTrendResponse,
  TopPagesQuery,
  TopPagesResponse,
  TopEventsQuery,
  TopEventsResponse,
  BreakdownQuery,
  BreakdownResponse,
} from './types';

export async function getOverview(query: OverviewQuery): Promise<OverviewResponse> {
  return api.get<OverviewResponse>('/analytics/overview', {
    params: { from: query.from.toISOString(), to: query.to.toISOString() },
  });
}

export async function getEventTrend(query: EventTrendQuery): Promise<EventTrendResponse> {
  return api.get<EventTrendResponse>('/analytics/event-trend', {
    params: {
      from: query.from,
      to: query.to,
      interval: query.interval,
    },
  });
}

export async function getTopPages(query: TopPagesQuery): Promise<TopPagesResponse> {
  return api.get<TopPagesResponse>('/analytics/top-pages', {
    params: {
      from: query.from,
      to: query.to,
      k: query.k,
    },
  });
}

export async function getTopEvents(query: TopEventsQuery): Promise<TopEventsResponse> {
  return api.get<TopEventsResponse>('/analytics/top-events', {
    params: {
      from: query.from,
      to: query.to,
      k: query.events_top,
    },
  });
}

export async function getBreakdown(query: BreakdownQuery): Promise<BreakdownResponse> {
  return api.get<BreakdownResponse>('/analytics/breakdown', {
    params: {
      from: query.from,
      to: query.to,
      dimension: query.dimension,
    },
  });
}
