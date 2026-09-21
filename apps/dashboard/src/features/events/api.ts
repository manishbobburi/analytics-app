import { api, requestDownload } from '@/lib/api';
import type { EventsResponse, EventsQuery, EventResponse, ExportEventsInput } from './types';

export async function getEvents(filters: EventsQuery): Promise<EventsResponse> {
  return api.get<EventsResponse>('/events', {
    params: filters,
  });
}

export async function getEvent(eventId: string): Promise<EventResponse> {
  return api.get<EventResponse>(`/events/${eventId}`);
}

export async function exportEvents(
  input: ExportEventsInput
): Promise<{ blob: Blob; filename?: string }> {
  return requestDownload({
    method: 'POST',
    url: '/export/events',
    data: input,
  });
}
