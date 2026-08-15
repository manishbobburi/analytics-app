import { api } from '@/lib/api';
import type { OverviewQuery, OverviewResponse, EventTrendQuery, EventTrendResponse } from './types';

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
