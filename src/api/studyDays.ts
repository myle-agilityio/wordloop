import { neon } from '@/lib'
import type { DateKey } from '@/types'

const TABLE = 'study_days'

/** Loads the days the signed-in user studied. Row-level security returns only their rows. */
export async function fetchStudyDays(): Promise<DateKey[]> {
  const { data, error } = await neon.from(TABLE).select('day')
  if (error) throw new Error(`Could not load your study days: ${error.message}`)
  return ((data ?? []) as { day: DateKey }[]).map((row) => row.day)
}

/** Records the given days as studied. Days already recorded are left as they are. */
export async function saveStudyDays(userId: string, days: DateKey[]): Promise<void> {
  if (days.length === 0) return

  const rows = days.map((day) => ({ user_id: userId, day }))
  const { error } = await neon
    .from(TABLE)
    .upsert(rows, { onConflict: 'user_id,day', ignoreDuplicates: true })
  if (error) throw new Error(`Could not save your study day: ${error.message}`)
}

export async function deleteAllStudyDays(userId: string): Promise<void> {
  const { error } = await neon.from(TABLE).delete().eq('user_id', userId)
  if (error) throw new Error(`Could not reset your study days: ${error.message}`)
}
