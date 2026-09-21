import type { AxiosResponseHeaders } from 'axios';
import { endOfDay, startOfDay } from 'date-fns';
import { EVENTS_PAGE_SIZE_OPTIONS, type EventsPageSize } from './types';

const DEFAULT_PAGE = '1';
const DEFAULT_LIMIT: EventsPageSize = '10';

export function parsePage(params: URLSearchParams): string {
  const value = params.get('page');

  if (!value) {
    return DEFAULT_PAGE;
  }

  return value;
}

export function parseLimit(params: URLSearchParams): EventsPageSize {
  const value = params.get('limit');

  if (value == null || !EVENTS_PAGE_SIZE_OPTIONS.includes(value as EventsPageSize)) {
    return DEFAULT_LIMIT;
  }

  return value as EventsPageSize;
}

export function setPage(params: URLSearchParams, page: string): URLSearchParams {
  const next = new URLSearchParams(params);

  next.set('page', page);

  return next;
}

export function setLimit(params: URLSearchParams, limit: EventsPageSize): URLSearchParams {
  const next = new URLSearchParams(params);

  next.set('limit', limit);

  return next;
}

export interface ExportEventResponse {
  blob: Blob;
  headers: AxiosResponseHeaders;
}

export function downloadExportFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export function getExportDateRange(from: Date, to: Date) {
  return {
    from: startOfDay(from).toISOString(),
    to: endOfDay(to).toISOString(),
  };
}
