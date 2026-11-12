import { describe, expect, it } from 'vitest'

import { DEFAULT_SETTINGS } from '@/constants'

import { rowToSettings, settingsToRow, type UserSettingsRow } from './settingsRow'

describe('settings rows', () => {
  it('round-trips settings through a row', () => {
    const row = settingsToRow('user-1', DEFAULT_SETTINGS)

    expect(row).toEqual({
      user_id: 'user-1',
      new_words_per_day: 5,
      hard_first_interval_days: 1,
      medium_first_interval_days: 3,
      easy_first_interval_days: 7,
      medium_multiplier: 1.5,
      easy_multiplier: 2.5,
      max_interval_days: 365,
    })
    expect(rowToSettings(row)).toEqual(DEFAULT_SETTINGS)
  })

  it('reads multipliers sent as strings', () => {
    const row = {
      ...settingsToRow('user-1', DEFAULT_SETTINGS),
      medium_multiplier: '1.30',
      easy_multiplier: '2.00',
    } as unknown as UserSettingsRow

    expect(rowToSettings(row).intervalMultiplier).toEqual({ medium: 1.3, easy: 2 })
  })
})
