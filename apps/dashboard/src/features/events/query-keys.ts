import type { EventsQuery } from './types';

export const eventsKeys = {
  all: ['events'] as const,

  lists: () => [...eventsKeys.all, 'list'] as const,

  list: (query: EventsQuery) => [...eventsKeys.lists(), query] as const,
};
