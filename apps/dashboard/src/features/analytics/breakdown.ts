import { BREAKDOWN_DIMENSIONS, type BreakdownDimensionPreset } from './types';

const DEFAULT_BREAKDOWN_DIMENSION_PRESET: BreakdownDimensionPreset = 'browser';

export const DIMENSION_LABELS: Record<BreakdownDimensionPreset, string> = {
  browser: 'Browser',
  device: 'Device',
  os: 'OS',
  referrer: 'Referrer',
};

function isValidDimension(dimension: string | null): dimension is BreakdownDimensionPreset {
  return dimension != null && BREAKDOWN_DIMENSIONS.includes(dimension as BreakdownDimensionPreset);
}

export function parseDimension(params: URLSearchParams): BreakdownDimensionPreset {
  const dimension = params.get('dimension');

  if (!isValidDimension(dimension)) {
    return DEFAULT_BREAKDOWN_DIMENSION_PRESET;
  }

  return dimension;
}

export function setBreakdownDimension(
  params: URLSearchParams,
  dimension: BreakdownDimensionPreset
): URLSearchParams {
  const next = new URLSearchParams(params);

  next.set('dimension', dimension);

  return next;
}
