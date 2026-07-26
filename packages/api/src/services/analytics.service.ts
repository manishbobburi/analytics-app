import { analyticsRepository } from '@app/db';
import { OverviewQuery, OverviewFilters, OverviewResponse } from '@app/shared';

async function getOverview(orgId: string, query: OverviewQuery): Promise<OverviewResponse> {
  const { from, to } = query;
  const inclusiveTo = to ? new Date(to) : undefined;

  if (inclusiveTo) inclusiveTo.setDate(inclusiveTo.getDate() + 1);

  const filters: OverviewFilters = {
    orgId,
    from,
    to: inclusiveTo,
  };

  const [totalEvents, uniqueUsers, anonymousUsers, sessions] = await Promise.all([
    analyticsRepository.getTotalEvents(filters),
    analyticsRepository.getUniqueUsers(filters),
    analyticsRepository.getAnanonymousUsers(filters),
    analyticsRepository.getSessionCount(filters),
  ]);

  return {
    totalEvents,
    uniqueUsers,
    anonymousUsers,
    sessions,
  };
}

export { getOverview };
