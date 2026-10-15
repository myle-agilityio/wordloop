/** A calendar day in the user's local time, formatted as YYYY-MM-DD. */
export type DateKey = string

export type Rating = 'hard' | 'medium' | 'easy'

export interface CardProgress {
  wordId: string
  /** The day the word was first studied. */
  learnedOn: DateKey
  /** The day the word is next due for review. */
  dueOn: DateKey
  /** Current gap between reviews, in days. */
  intervalDays: number
  /** How many times the word has been rated, including the first time. */
  reviewCount: number
  lastRating: Rating
}

export type ProgressMap = Record<string, CardProgress>
