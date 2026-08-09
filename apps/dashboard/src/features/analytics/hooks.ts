import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  parseDashboardDateRange,
  setDashboardDateRange,
  resolveDashboardDateRange,
} from './date-range';
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
