import type { CardProgress, ProgressMap } from '@/types'

/** A row of the `user_progress` table, as the Data API returns it. */
export interface UserProgressRow {
  user_id: string
  word_id: string
  learned_on: string
  due_on: string
  interval_days: number
  review_count: number
  last_rating: CardProgress['lastRating']
}

export function rowToCard(row: UserProgressRow): CardProgress {
  return {
    wordId: row.word_id,
    learnedOn: row.learned_on,
    dueOn: row.due_on,
    intervalDays: row.interval_days,
    reviewCount: row.review_count,
    lastRating: row.last_rating,
  }
}

export function cardToRow(userId: string, card: CardProgress): UserProgressRow {
  return {
    user_id: userId,
    word_id: card.wordId,
    learned_on: card.learnedOn,
    due_on: card.dueOn,
    interval_days: card.intervalDays,
    review_count: card.reviewCount,
    last_rating: card.lastRating,
  }
}

export function rowsToProgressMap(rows: UserProgressRow[]): ProgressMap {
  return Object.fromEntries(rows.map((row) => [row.word_id, rowToCard(row)]))
}
