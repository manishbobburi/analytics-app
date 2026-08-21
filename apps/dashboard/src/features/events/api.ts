import { api } from '@/lib/api';
import type { EventsResponse, EventsQuery, EventResponse } from './types';

export async function getEvents(filters: EventsQuery): Promise<EventsResponse> {
  return api.get<EventsResponse>('/events', {
    params: filters,
  });
}

export async function getEvent(eventId: string): Promise<EventResponse> {
  return api.get<EventResponse>(`/events/${eventId}`);
}
