import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getEvents } from './api';
import { eventsKeys } from './query-keys';
import type { EventsQuery } from './types';

export function useEvents(query: EventsQuery) {
  const queryResult = useQuery({
    queryKey: eventsKeys.list(query),
    queryFn: () => getEvents(query),
    placeholderData: keepPreviousData,
  });

  return {
    ...queryResult,
  };
}
