import type { StudySettings } from '@/types'

/** A row of the `user_settings` table, as the Data API returns it. */
export interface UserSettingsRow {
  user_id: string
  new_words_per_day: number
  hard_first_interval_days: number
  medium_first_interval_days: number
  easy_first_interval_days: number
  medium_multiplier: number
  easy_multiplier: number
  max_interval_days: number
}

export function rowToSettings(row: UserSettingsRow): StudySettings {
  return {
    newWordsPerDay: row.new_words_per_day,
    firstIntervalDays: {
      hard: row.hard_first_interval_days,
      medium: row.medium_first_interval_days,
      easy: row.easy_first_interval_days,
    },
    // numeric columns can arrive as strings, so convert them.
    intervalMultiplier: {
      medium: Number(row.medium_multiplier),
      easy: Number(row.easy_multiplier),
    },
    maxIntervalDays: row.max_interval_days,
  }
}

export function settingsToRow(userId: string, settings: StudySettings): UserSettingsRow {
  return {
    user_id: userId,
    new_words_per_day: settings.newWordsPerDay,
    hard_first_interval_days: settings.firstIntervalDays.hard,
    medium_first_interval_days: settings.firstIntervalDays.medium,
    easy_first_interval_days: settings.firstIntervalDays.easy,
    medium_multiplier: settings.intervalMultiplier.medium,
    easy_multiplier: settings.intervalMultiplier.easy,
    max_interval_days: settings.maxIntervalDays,
  }
}
