import { type EventFilters } from '@app/shared';

export type EventFiltersInput = Omit<EventFilters, 'orgId' | 'skip' | 'take'>;

export interface EventsQuery extends EventFiltersInput {
  page: number;
  limit: number;
}

export interface EventListItem {
  id: string;
  eventId: string;
  event: string;
  timestamp: string;

  userId: string | null;
  anonId: string | null;
  sessionId: string | null;

  pageUrl: string;
  pagePath: string;

  browserName: string;
  osName: string;
  deviceType: string;

  properties: Record<string, unknown>;
}

export interface EventsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
}

export interface EventsResponse {
  events: EventListItem[];
  pagination: EventsPagination;
}
