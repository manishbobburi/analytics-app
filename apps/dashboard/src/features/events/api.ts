import { api } from '@/lib/api';
import type { EventsResponse, EventsQuery } from './types';

export async function getEvents(filters: EventsQuery): Promise<EventsResponse> {
  return api.get<EventsResponse>('/events', {
    params: filters,
  });
}
