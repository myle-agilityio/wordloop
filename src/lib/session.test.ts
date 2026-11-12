import { describe, expect, it } from 'vitest'

import { DEFAULT_SETTINGS } from '@/constants'
import type { CardProgress, ProgressMap, Word } from '@/types'

import { buildSessionQueue, getDailyPlan, type SessionCard, sendCardAgain } from './session'

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
    const plan = getDailyPlan(words, {}, today, DEFAULT_SETTINGS.newWordsPerDay)

    expect(plan.reviews).toEqual([])
    expect(plan.newWords.map((w) => w.id)).toEqual(['w1', 'w2', 'w3', 'w4', 'w5'])
  })

  it('follows the new words per day setting', () => {
    expect(getDailyPlan(words, {}, today, 8).newWords).toHaveLength(8)
    expect(getDailyPlan(words, {}, today, 0).newWords).toEqual([])
  })

  it('only offers the new words left for today', () => {
    const progress: ProgressMap = {
      w1: makeProgress('w1', { learnedOn: today, dueOn: '2026-10-16' }),
      w2: makeProgress('w2', { learnedOn: today, dueOn: '2026-10-16' }),
    }
    const plan = getDailyPlan(words, progress, today, DEFAULT_SETTINGS.newWordsPerDay)

    expect(plan.newLearnedToday).toBe(2)
    expect(plan.newWords.map((w) => w.id)).toEqual(['w3', 'w4', 'w5'])
  })

  it('includes words due today or overdue, oldest first', () => {
    const progress: ProgressMap = {
      w1: makeProgress('w1', { dueOn: '2026-10-15' }),
      w2: makeProgress('w2', { dueOn: '2026-10-10' }),
      w3: makeProgress('w3', { dueOn: '2026-10-16' }),
    }
    const plan = getDailyPlan(words, progress, today, DEFAULT_SETTINGS.newWordsPerDay)

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

describe('sendCardAgain', () => {
  const queue: SessionCard[] = [
    { word: words[0], kind: 'review' },
    { word: words[1], kind: 'new' },
  ]

  it('adds the card to the end as a repeat and keeps the others in order', () => {
    const next = sendCardAgain(queue, 0)

    expect(next.map((card) => card.word.id)).toEqual(['w1', 'w2', 'w1'])
    expect(next[2]).toEqual({ word: words[0], kind: 'review', isRepeat: true })
  })

  it('does not change the queue it is given', () => {
    sendCardAgain(queue, 0)

    expect(queue).toHaveLength(2)
    expect(queue[0].isRepeat).toBeUndefined()
  })

  it('brings a word back until it is rated', () => {
    let current = queue
    let index = 0
    const shown: SessionCard[] = []
    // w1: Again, Again, then Easy. w2: Medium.
    const actions = ['again', 'medium', 'again', 'easy'] as const

    for (const action of actions) {
      shown.push(current[index])
      if (action === 'again') current = sendCardAgain(current, index)
      index += 1
      expect(index).toBeLessThanOrEqual(current.length)
    }

    expect(shown.map((card) => [card.word.id, card.isRepeat ?? false])).toEqual([
      ['w1', false],
      ['w2', false],
      ['w1', true],
      ['w1', true],
    ])
    expect(index).toBe(current.length) // session complete
  })
})
