import type { StudySettings } from '@/types'

/** Settings for a user who hasn't changed any, and while theirs are loading. */
export const DEFAULT_SETTINGS: StudySettings = {
  newWordsPerDay: 5,
  firstIntervalDays: { hard: 1, medium: 3, easy: 7 },
  intervalMultiplier: { medium: 1.5, easy: 2.5 },
  maxIntervalDays: 365,
}

/** Bounds for each setting. The database checks the same bounds. */
export const SETTINGS_LIMITS = {
  newWordsPerDay: { min: 0, max: 100 },
  intervalDays: { min: 1, max: 36500 },
  multiplier: { min: 1, max: 10 },
} as const
