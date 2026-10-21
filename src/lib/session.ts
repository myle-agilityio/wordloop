import { NEW_WORDS_PER_DAY } from '@/constants'
import type { DateKey, ProgressMap, Word } from '@/types'

export type SessionCardKind = 'review' | 'new'

export interface SessionCard {
  word: Word
  kind: SessionCardKind
  /** Set when the card was sent to the end of the session with Again. */
  isRepeat?: boolean
}

export interface DailyPlan {
  reviews: Word[]
  newWords: Word[]
  /** New words already studied today. */
  newLearnedToday: number
}

/** Works out what the user should study today: due reviews, then up to 5 new words. */
export function getDailyPlan(words: Word[], progress: ProgressMap, today: DateKey): DailyPlan {
  const byRank = [...words].sort((a, b) => a.rank - b.rank)
  const studied = byRank.filter((word) => progress[word.id])

  const reviews = studied
    .filter((word) => progress[word.id].dueOn <= today)
    .sort((a, b) => progress[a.id].dueOn.localeCompare(progress[b.id].dueOn))

  const newLearnedToday = studied.filter((word) => progress[word.id].learnedOn === today).length
  const remainingNew = Math.max(0, NEW_WORDS_PER_DAY - newLearnedToday)
  const newWords = byRank.filter((word) => !progress[word.id]).slice(0, remainingNew)

  return { reviews, newWords, newLearnedToday }
}

/** Builds the ordered card queue for a study session: reviews first, then new words. */
export function buildSessionQueue(plan: DailyPlan): SessionCard[] {
  return [
    ...plan.reviews.map((word) => ({ word, kind: 'review' as const })),
    ...plan.newWords.map((word) => ({ word, kind: 'new' as const })),
  ]
}

/** Adds the card at `index` to the end of the queue as a repeat; the cards before it stay put. */
export function sendCardAgain(queue: SessionCard[], index: number): SessionCard[] {
  return [...queue, { ...queue[index], isRepeat: true }]
}
