import { TOP_K_PRESETS, type TopEventsPreset } from './types';

export const DEFAULT_TOP_EVENTS_PRESET: TopEventsPreset = '5';

export const TOP_EVENTS_LABELS: Record<TopEventsPreset, string> = {
  '5': 'Top 5',
  '7': 'Top 7',
};

function isValid(events_top: string | null): events_top is TopEventsPreset {
  return events_top != null && TOP_K_PRESETS.includes(events_top as TopEventsPreset);
}

export function parseTopEvents(params: URLSearchParams): TopEventsPreset {
  const events_top = params.get('events_top');

  if (!isValid(events_top)) {
    return DEFAULT_TOP_EVENTS_PRESET;
  }

  return events_top;
}

export function setTopEvents(
  params: URLSearchParams,
  events_top: TopEventsPreset
): URLSearchParams {
  const next = new URLSearchParams(params);

  next.set('events_top', events_top);

  return next;
}
