import { format, isValid, parseISO } from 'date-fns';

import { DATE_RANGE_PRESETS, type DashboardDateRange, type DateRangePreset } from './types';

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
