/**
 * Placeholder company statistics.
 * Update these values — no component code needs to change.
 */
export const STATS_CONFIG = [
  {
    key: 'years',
    value: 15,
    suffix: '+',
    labelKey: 'stats.years',
  },
  {
    key: 'projects',
    value: 200,
    suffix: '+',
    labelKey: 'stats.projects',
  },
  {
    key: 'engineers',
    value: 500,
    suffix: '+',
    labelKey: 'stats.engineers',
  },
  {
    key: 'satisfaction',
    value: 98,
    suffix: '%',
    labelKey: 'stats.satisfaction',
  },
] as const;

export type StatItem = (typeof STATS_CONFIG)[number];
