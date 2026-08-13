import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
  parseDashboardDateRange,
  setDashboardDateRange,
  resolveDashboardDateRange,
} from './date-range';
import { getOverview } from './api';
import { analyticsKeys } from './query-keys';
import type { DashboardDateRange } from './types';

export function useDashboardDateRange() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateRange = useMemo(() => parseDashboardDateRange(searchParams), [searchParams]);

  const resolveDateRange = useMemo(() => resolveDashboardDateRange(dateRange), [dateRange]);

  const setDateRange = useCallback(
    (nextRange: DashboardDateRange) => {
      const nextParams = setDashboardDateRange(searchParams, nextRange);

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  return {
    dateRange,
    resolveDateRange,
    setDateRange,
  };
}

export function useOverview() {
  const { resolveDateRange } = useDashboardDateRange();

  return useQuery({
    queryKey: analyticsKeys.overview(resolveDateRange),
    queryFn: () => getOverview(resolveDateRange),
  });
}
