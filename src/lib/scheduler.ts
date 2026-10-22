import { FIRST_INTERVAL_DAYS, INTERVAL_MULTIPLIER } from '@/constants'
import type { CardProgress, DateKey, Rating } from '@/types'
import { addDays } from '@/utils'

/** Next gap in days, given the current gap (undefined for a new word) and the rating. */
export function nextIntervalDays(currentInterval: number | undefined, rating: Rating): number {
  const firstInterval = FIRST_INTERVAL_DAYS[rating]
  if (currentInterval === undefined || rating === 'hard') return firstInterval

  const grown = Math.round(currentInterval * INTERVAL_MULTIPLIER[rating])
  return Math.max(firstInterval, grown)
}

/** The day the word would be due next for each rating, shown before the user picks one. */
export function previewDueOn(
  previous: CardProgress | undefined,
  today: DateKey,
): Record<Rating, DateKey> {
  const dueOn = (rating: Rating) => addDays(today, nextIntervalDays(previous?.intervalDays, rating))
  return { hard: dueOn('hard'), medium: dueOn('medium'), easy: dueOn('easy') }
}

/** Applies a rating to a word and returns its updated progress. */
export function scheduleReview(
  wordId: string,
  previous: CardProgress | undefined,
  rating: Rating,
  today: DateKey,
): CardProgress {
  const intervalDays = nextIntervalDays(previous?.intervalDays, rating)

  return {
    wordId,
    learnedOn: previous?.learnedOn ?? today,
    dueOn: addDays(today, intervalDays),
    intervalDays,
    reviewCount: (previous?.reviewCount ?? 0) + 1,
    lastRating: rating,
  }
}
