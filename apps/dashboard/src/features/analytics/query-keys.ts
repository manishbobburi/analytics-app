import type { OverviewQuery } from '@app/shared';

export const analyticsKeys = {
  all: ['analytics'] as const,

  overview: (query: OverviewQuery) =>
    [...analyticsKeys.all, 'overview', query.from.toISOString(), query.to.toISOString()] as const,
};
