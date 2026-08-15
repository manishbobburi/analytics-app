export type {
  OverviewQuery,
  OverviewResponse,
  EventTrendPoint,
  EventTrendResponse,
} from '@app/shared';

export const DATE_RANGE_PRESETS = [
  'today',
  'yesterday',
  'last-7-days',
  'last-30-days',
  'last-90-days',
  'this-month',
  'last-month',
  'custom',
] as const;

export type DateRangePreset = (typeof DATE_RANGE_PRESETS)[number];

export interface DashboardDateRange {
  preset: DateRangePreset;
  from?: string;
  to?: string;
}

export interface ResolvedDateRange {
  from: Date;
  to: Date;
}

export const EVENT_TREND_INTERVALS = ['hour', 'day', 'week'] as const;

export type EventTrendInterval = (typeof EVENT_TREND_INTERVALS)[number];

export interface EventTrendQuery {
  from: Date;
  to: Date;
  interval: EventTrendInterval;
}
