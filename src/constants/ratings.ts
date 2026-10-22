import type { Rating } from '@/types'

export interface RatingOption {
  value: Rating
  label: string
  description: string
  shortcut: string
}

export const RATING_OPTIONS: RatingOption[] = [
  { value: 'hard', label: 'Hard', description: "Struggled or didn't remember", shortcut: '1' },
  { value: 'medium', label: 'Medium', description: 'Got it, but had to think', shortcut: '2' },
  { value: 'easy', label: 'Easy', description: 'Knew it right away', shortcut: '3' },
]

/** Not a rating: sends the word to the end of the session without scheduling it. */
export const AGAIN_OPTION: Omit<RatingOption, 'value'> = {
  label: 'Again',
  description: 'Need another look right away',
  shortcut: '4',
}
