import { neon } from '@/lib/neon'
import { cardToRow, rowsToProgressMap, type UserProgressRow } from '@/lib/progressRow'
import type { CardProgress, ProgressMap } from '@/types'

const TABLE = 'user_progress'

/** Loads the signed-in user's progress. Row-level security returns only their rows. */
export async function fetchProgress(): Promise<ProgressMap> {
  const { data, error } = await neon.from(TABLE).select('*')
  if (error) throw new Error(`Could not load your progress: ${error.message}`)
  return rowsToProgressMap((data ?? []) as UserProgressRow[])
}

/** Inserts or updates progress for the given words. */
export async function saveProgress(userId: string, cards: CardProgress[]): Promise<void> {
  if (cards.length === 0) return

  const rows = cards.map((card) => ({
    ...cardToRow(userId, card),
    updated_at: new Date().toISOString(),
  }))
  const { error } = await neon.from(TABLE).upsert(rows, { onConflict: 'user_id,word_id' })
  if (error) throw new Error(`Could not save your progress: ${error.message}`)
}

export async function deleteAllProgress(userId: string): Promise<void> {
  const { error } = await neon.from(TABLE).delete().eq('user_id', userId)
  if (error) throw new Error(`Could not reset your progress: ${error.message}`)
}
