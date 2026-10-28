import { SETTINGS_LIMITS } from '@/constants'
import type { GrowingRating, Rating, StudySettings } from '@/types'

/** A form field on the Settings page, named after its path in StudySettings. */
export type SettingsField =
  | 'newWordsPerDay'
  | `firstIntervalDays.${Rating}`
  | `intervalMultiplier.${GrowingRating}`
  | 'maxIntervalDays'

export type SettingsErrors = Partial<Record<SettingsField, string>>

const wholeNumberError = (value: number, min: number, max: number) =>
  Number.isInteger(value) && value >= min && value <= max
    ? undefined
    : `Enter a whole number from ${min} to ${max}.`

const multiplierError = (value: number) => {
  const { min, max } = SETTINGS_LIMITS.multiplier
  const hasTwoDecimalsAtMost = Math.round(value * 100) / 100 === value
  return Number.isFinite(value) && value >= min && value <= max && hasTwoDecimalsAtMost
    ? undefined
    : `Enter a number from ${min} to ${max}, with at most 2 decimals.`
}

/** Checks the settings the user entered. Empty when they can be saved. Empty inputs arrive as NaN. */
export function validateSettings(settings: StudySettings): SettingsErrors {
  const { newWordsPerDay, intervalDays } = SETTINGS_LIMITS
  const { firstIntervalDays: first, intervalMultiplier: multiplier } = settings
  const errors: SettingsErrors = {}
  const set = (field: SettingsField, error: string | undefined) => {
    if (error && !errors[field]) errors[field] = error
  }

  set(
    'newWordsPerDay',
    wholeNumberError(settings.newWordsPerDay, newWordsPerDay.min, newWordsPerDay.max),
  )
  for (const rating of ['hard', 'medium', 'easy'] as const) {
    set(
      `firstIntervalDays.${rating}`,
      wholeNumberError(first[rating], intervalDays.min, intervalDays.max),
    )
  }
  set(
    'maxIntervalDays',
    wholeNumberError(settings.maxIntervalDays, intervalDays.min, intervalDays.max),
  )
  set('intervalMultiplier.medium', multiplierError(multiplier.medium))
  set('intervalMultiplier.easy', multiplierError(multiplier.easy))

  // An easier rating never brings a word back sooner than a harder one.
  if (first.medium < first.hard)
    set('firstIntervalDays.medium', 'Must be at least the Hard interval.')
  if (first.easy < first.medium)
    set('firstIntervalDays.easy', 'Must be at least the Medium interval.')
  if (multiplier.easy < multiplier.medium) {
    set('intervalMultiplier.easy', 'Must be at least the Medium multiplier.')
  }
  if (settings.maxIntervalDays < first.easy) {
    set('maxIntervalDays', 'Must be at least the Easy first interval.')
  }

  return errors
}
