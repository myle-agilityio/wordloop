import type { Rating } from './progress'

/** A rating that grows the gap between reviews. Hard resets it instead. */
export type GrowingRating = Exclude<Rating, 'hard'>

/** How a user's reviews are scheduled, set on the Settings page. */
export interface StudySettings {
  newWordsPerDay: number
  /** Gap in days before the first review, based on the first rating. */
  firstIntervalDays: Record<Rating, number>
  /** How much the gap grows on later reviews. */
  intervalMultiplier: Record<GrowingRating, number>
  /** No gap grows past this many days. */
  maxIntervalDays: number
}
