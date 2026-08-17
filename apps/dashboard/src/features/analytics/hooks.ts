import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import {
  parseDashboardDateRange,
  setDashboardDateRange,
  resolveDashboardDateRange,
} from './date-range';
import { parseEventTrendInterval, setEventTrendInterval } from './event-trend';
import { parseTopPagesK, setTopPagesK } from './top-pages';
import { getOverview, getEventTrend, getTopPages } from './api';
import { analyticsKeys } from './query-keys';
import type { DashboardDateRange, EventTrendInterval, TopPagesPreset } from './types';

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
    [searchParams, setSearchParams]
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

export function useTopPages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { resolvedDateRange } = useDashboardDateRange();

  const k = useMemo(() => parseTopPagesK(searchParams), [searchParams]);

  const query = useMemo(
    () => ({
      ...resolvedDateRange,
      k,
    }),
    [resolvedDateRange, k]
  );

  const setK = useCallback(
    (nextK: TopPagesPreset) => {
      const nextParams = setTopPagesK(searchParams, nextK);

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  const queryResult = useQuery({
    queryKey: analyticsKeys.topPages(query),
    queryFn: () => getTopPages(query),
  });

  return {
    ...queryResult,
    k,
    setK,
  };
}
