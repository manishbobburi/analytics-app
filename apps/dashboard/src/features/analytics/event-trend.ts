import { format, subDays, isSameDay, isSameYear } from 'date-fns';

import { EVENT_TREND_INTERVALS, type EventTrendInterval } from './types';

export const DEFAULT_EVENT_TREND_INTERVAL: EventTrendInterval = 'day';

export const EVENT_TREND_INTERVAL_LABELS: Record<EventTrendInterval, string> = {
  hour: 'Hour',
  day: 'Day',
  week: 'Week',
};

export function isEventTrendInterval(value: string | null): value is EventTrendInterval {
  return value !== null && EVENT_TREND_INTERVALS.includes(value as EventTrendInterval);
}

export function parseEventTrendInterval(params: URLSearchParams): EventTrendInterval {
  const value = params.get('interval');

  if (!isEventTrendInterval(value)) {
    return DEFAULT_EVENT_TREND_INTERVAL;
  }

  return value;
}

export function setEventTrendInterval(
  params: URLSearchParams,
  interval: EventTrendInterval
): URLSearchParams {
  const next = new URLSearchParams(params);

  next.set('interval', interval);

  return next;
}

export function formatDateRangeDescription(from: Date, to: Date): string {
  const inclusiveTo = subDays(to, 1);

  if (isSameYear(from, inclusiveTo)) {
    if (isSameDay(from, inclusiveTo)) {
      return `Total of ${format(from, 'MMM d, yyyy')}`;
    } else {
      return `Total from ${format(from, 'MMM d')} to ${format(inclusiveTo, 'MMM d, yyyy')}`;
    }
  }

  return `Total from ${format(from, 'MMM d, yyyy')} to ${format(inclusiveTo, 'MMM d, yyyy')}`;
}
