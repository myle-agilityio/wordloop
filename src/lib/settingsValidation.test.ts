import { describe, expect, it } from 'vitest'

import { DEFAULT_SETTINGS } from '@/constants'
import type { StudySettings } from '@/types'

import { validateSettings } from './settingsValidation'

const withSettings = (overrides: Partial<StudySettings>): StudySettings => ({
  ...DEFAULT_SETTINGS,
  ...overrides,
})

describe('validateSettings', () => {
  it('accepts the defaults', () => {
    expect(validateSettings(DEFAULT_SETTINGS)).toEqual({})
  })

  it('accepts zero new words a day, for review-only days', () => {
    expect(validateSettings(withSettings({ newWordsPerDay: 0 }))).toEqual({})
  })

  it('rejects empty, fractional and out-of-range whole numbers', () => {
    const errors = validateSettings(
      withSettings({
        newWordsPerDay: Number.NaN,
        firstIntervalDays: { hard: 0, medium: 3.5, easy: 7 },
        maxIntervalDays: 40000,
      }),
    )

    expect(errors.newWordsPerDay).toBe('Enter a whole number from 0 to 100.')
    expect(errors['firstIntervalDays.hard']).toBe('Enter a whole number from 1 to 36500.')
    expect(errors['firstIntervalDays.medium']).toBe('Enter a whole number from 1 to 36500.')
    expect(errors.maxIntervalDays).toBe('Enter a whole number from 1 to 36500.')
  })

  it('rejects multipliers below 1, above 10 or with more than 2 decimals', () => {
    expect(
      validateSettings(withSettings({ intervalMultiplier: { medium: 0.9, easy: 2.5 } }))[
        'intervalMultiplier.medium'
      ],
    ).toBeDefined()
    expect(
      validateSettings(withSettings({ intervalMultiplier: { medium: 1.5, easy: 11 } }))[
        'intervalMultiplier.easy'
      ],
    ).toBeDefined()
    expect(
      validateSettings(withSettings({ intervalMultiplier: { medium: 1.255, easy: 2.5 } }))[
        'intervalMultiplier.medium'
      ],
    ).toBeDefined()
    expect(
      validateSettings(withSettings({ intervalMultiplier: { medium: 1.15, easy: 2.5 } })),
    ).toEqual({})
  })

  it('requires first intervals ordered Hard, Medium, Easy', () => {
    const errors = validateSettings(
      withSettings({ firstIntervalDays: { hard: 4, medium: 3, easy: 2 } }),
    )

    expect(errors['firstIntervalDays.medium']).toBe('Must be at least the Hard interval.')
    expect(errors['firstIntervalDays.easy']).toBe('Must be at least the Medium interval.')
  })

  it('requires the Easy multiplier to be at least the Medium one', () => {
    const errors = validateSettings(withSettings({ intervalMultiplier: { medium: 2, easy: 1.5 } }))
    expect(errors['intervalMultiplier.easy']).toBe('Must be at least the Medium multiplier.')
  })

  it('requires the maximum interval to be at least the Easy first interval', () => {
    const errors = validateSettings(withSettings({ maxIntervalDays: 5 }))
    expect(errors.maxIntervalDays).toBe('Must be at least the Easy first interval.')
  })
})
