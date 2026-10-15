import type { Rating } from '@/types'

export const NEW_WORDS_PER_DAY = 5

/** Gap in days before the first review, based on the first rating. */
export const FIRST_INTERVAL_DAYS: Record<Rating, number> = {
  hard: 1,
  medium: 3,
  easy: 7,
}

/** How much the gap grows on later reviews. Hard resets the gap to its first interval. */
export const INTERVAL_MULTIPLIER: Record<Exclude<Rating, 'hard'>, number> = {
  medium: 1.5,
  easy: 2.5,
}
