import type { CardProgress, DateKey, Rating, StudySettings } from '@/types'
import { addDays } from '@/utils'

/** Next gap in days, given the current gap (undefined for a new word), the rating and the user's settings. */
export function nextIntervalDays(
  currentInterval: number | undefined,
  rating: Rating,
  settings: StudySettings,
): number {
  const firstInterval = settings.firstIntervalDays[rating]
  if (currentInterval === undefined || rating === 'hard') {
    return Math.min(firstInterval, settings.maxIntervalDays)
  }

  const grown = Math.round(currentInterval * settings.intervalMultiplier[rating])
  return Math.min(Math.max(firstInterval, grown), settings.maxIntervalDays)
}

/** The gaps a new word gets if it is rated the same way every time, for previewing settings. */
export function intervalSequence(rating: Rating, settings: StudySettings, count = 5): number[] {
  const sequence: number[] = []
  let interval: number | undefined
  for (let i = 0; i < count; i += 1) {
    interval = nextIntervalDays(interval, rating, settings)
    sequence.push(interval)
  }
  return sequence
}

/** The day the word would be due next for each rating, shown before the user picks one. */
export function previewDueOn(
  previous: CardProgress | undefined,
  today: DateKey,
  settings: StudySettings,
): Record<Rating, DateKey> {
  const dueOn = (rating: Rating) =>
    addDays(today, nextIntervalDays(previous?.intervalDays, rating, settings))
  return { hard: dueOn('hard'), medium: dueOn('medium'), easy: dueOn('easy') }
}

/** Applies a rating to a word and returns its updated progress. */
export function scheduleReview(
  wordId: string,
  previous: CardProgress | undefined,
  rating: Rating,
  today: DateKey,
  settings: StudySettings,
): CardProgress {
  const intervalDays = nextIntervalDays(previous?.intervalDays, rating, settings)

  return {
    wordId,
    learnedOn: previous?.learnedOn ?? today,
    dueOn: addDays(today, intervalDays),
    intervalDays,
    reviewCount: (previous?.reviewCount ?? 0) + 1,
    lastRating: rating,
  }
}
