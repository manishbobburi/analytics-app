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
