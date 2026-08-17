export type {
  OverviewQuery,
  OverviewResponse,
  EventTrendPoint,
  EventTrendResponse,
  TopPage,
  TopPagesResponse,
  TopEvent,
  TopEventsResponse,
  BreakdownRecord,
  BreakdownResponse,
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

export const TOP_K_PRESETS = ['5', '7'] as const;

export type TopPagesPreset = (typeof TOP_K_PRESETS)[number];

export interface TopPagesQuery {
  from: Date;
  to: Date;
  k: TopPagesPreset;
}

export type TopEventsPreset = (typeof TOP_K_PRESETS)[number];

export interface TopEventsQuery {
  from: Date;
  to: Date;
  events_top: TopEventsPreset;
}

export const BREAKDOWN_DIMENSIONS = ['device', 'browser', 'os', 'referrer'] as const;

export type BreakdownDimensionPreset = (typeof BREAKDOWN_DIMENSIONS)[number];

export interface BreakdownQuery {
  from: Date;
  to: Date;
  dimension: BreakdownDimensionPreset;
}
