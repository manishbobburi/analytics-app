import {
  addDays,
  addMonths,
  format,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

import {
  DATE_RANGE_PRESETS,
  type DashboardDateRange,
  type DateRangePreset,
  type ResolvedDateRange,
} from './types';

export const DEFAULT_DATE_RANGE: DashboardDateRange = {
  preset: 'last-30-days',
};

export const DATE_RANGE_LABELS: Record<DateRangePreset, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  'last-7-days': 'Last 7 days',
  'last-30-days': 'Last 30 days',
  'last-90-days': 'Last 90 days',
  'this-month': 'This month',
  'last-month': 'Last month',
  custom: 'Custom range',
};

export function isDateRangePreset(value: string | null): value is DateRangePreset {
  return value !== null && DATE_RANGE_PRESETS.includes(value as DateRangePreset);
}

export function parseDashboardDateRange(params: URLSearchParams): DashboardDateRange {
  const rangeParam = params.get('range');

  if (!isDateRangePreset(rangeParam)) {
    return DEFAULT_DATE_RANGE;
  }

  if (rangeParam !== 'custom') {
    return {
      preset: rangeParam,
    };
  }

  const from = params.get('from');
  const to = params.get('to');

  if (!from || !to) {
    return DEFAULT_DATE_RANGE;
  }

  if (!isValidDateOnly(from) || !isValidDateOnly(to)) {
    return DEFAULT_DATE_RANGE;
  }

  if (from > to) {
    return DEFAULT_DATE_RANGE;
  }

  return {
    preset: 'custom',
    from,
    to,
  };
}

export function setDashboardDateRange(
  params: URLSearchParams,
  range: DashboardDateRange
): URLSearchParams {
  const next = new URLSearchParams(params);

  next.set('range', range.preset);

  next.delete('from');
  next.delete('to');

  if (range.preset === 'custom') {
    if (!range.from || !range.to) {
      return next;
    }

    next.set('from', range.from);
    next.set('to', range.to);
  }

  return next;
}

export function resolveDashboardDateRange(
  range: DashboardDateRange,
  timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
  now: Date = new Date()
): ResolvedDateRange {
  const zonedNow = now;
  const today = startOfDay(zonedNow);
  const monthStart = startOfMonth(zonedNow);

  switch (range.preset) {
    case 'today': {
      return createRange(startOfDay(zonedNow), addDays(startOfDay(zonedNow), 1), timezone);
    }

    case 'yesterday': {
      return createRange(subDays(today, 1), today, timezone);
    }

    case 'last-7-days': {
      return createRange(subDays(today, 6), addDays(today, 1), timezone);
    }

    case 'last-30-days': {
      return createRange(subDays(today, 29), addDays(today, 1), timezone);
    }

    case 'last-90-days': {
      return createRange(subDays(today, 89), addDays(today, 1), timezone);
    }

    case 'this-month': {
      return createRange(monthStart, addMonths(monthStart, 1), timezone);
    }

    case 'last-month': {
      const previousMonth = subMonths(zonedNow, 1);
      const monthStart = startOfMonth(previousMonth);
      const currentMonthStart = startOfMonth(zonedNow);

      return createRange(monthStart, currentMonthStart, timezone);
    }

    case 'custom': {
      if (!range.from || !range.to) {
        throw new Error('Custom date range requires both from and to dates.');
      }

      const from = parseISO(range.from);
      const to = parseISO(range.to);

      if (!isValid(from) || !isValid(to)) {
        throw new Error('Invalid custom date range.');
      }

      if (range.from > range.to) {
        throw new Error('Custom date range `from` must not be after `to`.');
      }

      return createRange(startOfDay(from), addDays(startOfDay(to), 1), timezone);
    }

    default: {
      return assertNever(range.preset);
    }
  }
}

function createRange(from: Date, to: Date, timezone: string): ResolvedDateRange {
  return {
    from: fromZonedTime(from, timezone),
    to: fromZonedTime(to, timezone),
  };
}

function assertNever(value: never): never {
  throw new Error(`Unhandled date range preset: ${String(value)}`);
}

export function formatDateForUrl(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    // Strict YYYY-MM-DD check.
    return false;
  }

  const date = parseISO(value);

  return isValid(date) && format(date, 'yyyy-MM-dd') === value;
}
