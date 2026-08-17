import { TOP_K_PRESETS, type TopPagesPreset } from './types';

export const DEFAULT_TOP_PAGES_PRESET: TopPagesPreset = '5';

export const TOP_PAGES_LABELS: Record<TopPagesPreset, string> = {
  '5': 'Top 5',
  '7': 'Top 7',
};

function isValidK(k: string | null): k is TopPagesPreset {
  return k != null && TOP_K_PRESETS.includes(k as TopPagesPreset);
}

export function parseTopPagesK(params: URLSearchParams): TopPagesPreset {
  const k = params.get('k');

  if (!isValidK(k)) {
    return DEFAULT_TOP_PAGES_PRESET;
  }

  return k;
}

export function setTopPagesK(params: URLSearchParams, k: TopPagesPreset): URLSearchParams {
  const next = new URLSearchParams(params);

  next.set('k', k);

  return next;
}
