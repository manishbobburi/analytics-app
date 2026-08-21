import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getEvents, getEvent } from './api';
import { eventsKeys } from './query-keys';
import type { EventsPageSize } from './types';
import { parseLimit, parsePage, setPage, setLimit } from './events';

function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => parsePage(searchParams), [searchParams]);
  const limit = useMemo(() => parseLimit(searchParams), [searchParams]);

  const setPageParam = useCallback(
    (nextPage: string) => {
      const nextParams = setPage(searchParams, nextPage);

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  const setLimitParam = useCallback(
    (nextLimit: EventsPageSize) => {
      const nextParams = setLimit(searchParams, nextLimit);

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams]
  );

  return {
    page,
    limit,
    setPageParam,
    setLimitParam,
  };
}

export function useEvents() {
  const { page, limit, setLimitParam, setPageParam } = usePagination();

  const query = useMemo(
    () => ({
      page,
      limit,
    }),
    [page, limit]
  );

  const queryResult = useQuery({
    queryKey: eventsKeys.list(query),
    queryFn: () => getEvents(query),
    placeholderData: keepPreviousData,
  });

  return {
    ...queryResult,
    page,
    limit,
    setPageParam,
    setLimitParam,
  };
}

export function useEvent(eventId: string | null) {
  return useQuery({
    queryKey: eventsKeys.detail(eventId ?? ''),
    queryFn: () => getEvent(eventId!),
    enabled: Boolean(eventId),
  });
}
