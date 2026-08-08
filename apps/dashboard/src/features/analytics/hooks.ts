import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { parseDashboardDateRange, setDashboardDateRange } from './date-range';
import type { DashboardDateRange } from './types';

export function useDashboardDateRange() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateRange = useMemo(() => parseDashboardDateRange(searchParams), [searchParams]);

  const setDateRange = useCallback(
    (nextRange: DashboardDateRange) => {
      const nextParams = setDashboardDateRange(searchParams, nextRange);

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  return {
    dateRange,
    setDateRange,
  };
}
