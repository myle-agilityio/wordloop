import { describe, expect, it } from 'vitest'

import type { CardProgress, ProgressMap, Word } from '@/types'

import { buildSessionQueue, getDailyPlan } from './session'

const makeWord = (rank: number): Word => ({
  id: `w${rank}`,
  rank,
  word: `word${rank}`,
  partOfSpeech: 'noun',
  meaning: '',
  examples: [],
})

const makeProgress = (wordId: string, overrides: Partial<CardProgress>): CardProgress => ({
  wordId,
  learnedOn: '2026-10-01',
  dueOn: '2026-10-20',
  intervalDays: 3,
  reviewCount: 1,
  lastRating: 'medium',
  ...overrides,
})

const words = Array.from({ length: 20 }, (_, i) => makeWord(i + 1))
const today = '2026-10-15'

describe('getDailyPlan', () => {
  it('offers the 5 most common words to a new user', () => {
    const plan = getDailyPlan(words, {}, today)

    expect(plan.reviews).toEqual([])
    expect(plan.newWords.map((w) => w.id)).toEqual(['w1', 'w2', 'w3', 'w4', 'w5'])
  })

  it('only offers the new words left for today', () => {
    const progress: ProgressMap = {
      w1: makeProgress('w1', { learnedOn: today, dueOn: '2026-10-16' }),
      w2: makeProgress('w2', { learnedOn: today, dueOn: '2026-10-16' }),
    }
    const plan = getDailyPlan(words, progress, today)

    expect(plan.newLearnedToday).toBe(2)
    expect(plan.newWords.map((w) => w.id)).toEqual(['w3', 'w4', 'w5'])
  })

  it('includes words due today or overdue, oldest first', () => {
    const progress: ProgressMap = {
      w1: makeProgress('w1', { dueOn: '2026-10-15' }),
      w2: makeProgress('w2', { dueOn: '2026-10-10' }),
      w3: makeProgress('w3', { dueOn: '2026-10-16' }),
    }
    const plan = getDailyPlan(words, progress, today)

    expect(plan.reviews.map((w) => w.id)).toEqual(['w2', 'w1'])
  })
})

describe('buildSessionQueue', () => {
  it('puts reviews before new words', () => {
    const queue = buildSessionQueue({
      reviews: [words[9]],
      newWords: [words[0]],
      newLearnedToday: 0,
    })

    expect(queue.map((card) => card.kind)).toEqual(['review', 'new'])
  })
})
