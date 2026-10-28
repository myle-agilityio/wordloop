import { DEFAULT_SETTINGS } from '@/constants'
import { neon, rowToSettings, settingsToRow, type UserSettingsRow } from '@/lib'
import type { StudySettings } from '@/types'

const TABLE = 'user_settings'

/** Loads the signed-in user's settings, or the defaults if they never saved any. */
export async function fetchSettings(): Promise<StudySettings> {
  const { data, error } = await neon.from(TABLE).select('*')
  if (error) throw new Error(`Could not load your settings: ${error.message}`)
  // Row-level security returns at most the user's own row.
  const [row] = (data ?? []) as UserSettingsRow[]
  return row ? rowToSettings(row) : DEFAULT_SETTINGS
}

export async function saveSettings(userId: string, settings: StudySettings): Promise<void> {
  const row = { ...settingsToRow(userId, settings), updated_at: new Date().toISOString() }
  const { error } = await neon.from(TABLE).upsert(row, { onConflict: 'user_id' })
  if (error) throw new Error(`Could not save your settings: ${error.message}`)
}
