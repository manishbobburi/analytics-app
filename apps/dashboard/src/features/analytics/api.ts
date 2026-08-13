import { api } from '@/lib/api';
import type { OverviewQuery, OverviewResponse } from '@app/shared';

export async function getOverview(query: OverviewQuery): Promise<OverviewResponse> {
  return api.get<OverviewResponse>('/analytics/overview', {
    params: { from: query.from.toISOString(), to: query.to.toISOString() },
  });
}
