import { api } from '@/lib/api';
import type { EventFiltersInput, EventsResponse } from './types';

export async function getEvents(filters: EventFiltersInput): Promise<EventsResponse> {
  return api.get<EventsResponse>('/events', {
    params: filters,
  });
}
