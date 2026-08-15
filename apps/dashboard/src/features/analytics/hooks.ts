import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
  parseDashboardDateRange,
  setDashboardDateRange,
  resolveDashboardDateRange,
} from './date-range';
import { parseEventTrendInterval, setEventTrendInterval } from './event-trend';
import { getOverview, getEventTrend } from './api';
import { analyticsKeys } from './query-keys';
import type { DashboardDateRange, EventTrendInterval } from './types';

export function useDashboardDateRange() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateRange = useMemo(() => parseDashboardDateRange(searchParams), [searchParams]);

  const resolvedDateRange = useMemo(() => resolveDashboardDateRange(dateRange), [dateRange]);

  const setDateRange = useCallback(
    (nextRange: DashboardDateRange) => {
      const nextParams = setDashboardDateRange(searchParams, nextRange);

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  return {
    dateRange,
    resolvedDateRange,
    setDateRange,
  };
}

export function useOverview() {
  const { resolvedDateRange } = useDashboardDateRange();

  return useQuery({
    queryKey: analyticsKeys.overview(resolvedDateRange),
    queryFn: () => getOverview(resolvedDateRange),
  });
}

export function useEventTrend() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { resolvedDateRange } = useDashboardDateRange();

  const interval = useMemo(() => parseEventTrendInterval(searchParams), [searchParams]);

  const query = useMemo(
    () => ({
      ...resolvedDateRange,
      interval,
    }),
    [resolvedDateRange, interval]
  );

  const setInterval = useCallback(
    (nextInterval: EventTrendInterval) => {
      const nextParams = setEventTrendInterval(searchParams, nextInterval);

      setSearchParams(nextParams);
    },
    [searchParams, searchParams]
  );

  const queryResult = useQuery({
    queryKey: analyticsKeys.eventTrend(query),
    queryFn: () => getEventTrend(query),
  });

  return {
    ...queryResult,
    interval,
    setInterval,
  };
}
