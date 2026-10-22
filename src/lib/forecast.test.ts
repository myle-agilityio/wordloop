import { describe, expect, it } from 'vitest'

import type { CardProgress, DateKey, ProgressMap } from '@/types'

import { reviewForecast } from './forecast'

const TODAY = '2026-10-22'

const card = (wordId: string, dueOn: DateKey): CardProgress => ({
  wordId,
  learnedOn: '2026-10-01',
  dueOn,
  intervalDays: 1,
  reviewCount: 1,
  lastRating: 'medium',
})

const progressOf = (...cards: CardProgress[]): ProgressMap =>
  Object.fromEntries(cards.map((c) => [c.wordId, c]))

describe('reviewForecast', () => {
  it('returns the next seven days with zero counts when there is no progress', () => {
    expect(reviewForecast({}, TODAY)).toEqual([
      { date: '2026-10-23', count: 0 },
      { date: '2026-10-24', count: 0 },
      { date: '2026-10-25', count: 0 },
      { date: '2026-10-26', count: 0 },
      { date: '2026-10-27', count: 0 },
      { date: '2026-10-28', count: 0 },
      { date: '2026-10-29', count: 0 },
    ])
  })

  it('counts cards on each day they are due', () => {
    const progress = progressOf(
      card('a', '2026-10-23'),
      card('b', '2026-10-23'),
      card('c', '2026-10-25'),
      card('d', '2026-10-29'),
    )
    expect(reviewForecast(progress, TODAY).map((day) => day.count)).toEqual([2, 0, 1, 0, 0, 0, 1])
  })

  it('leaves out cards due today or overdue', () => {
    const progress = progressOf(card('a', TODAY), card('b', '2026-10-20'), card('c', '2026-10-24'))
    expect(reviewForecast(progress, TODAY).map((day) => day.count)).toEqual([0, 1, 0, 0, 0, 0, 0])
  })

  it('leaves out cards due after the window', () => {
    const progress = progressOf(card('a', '2026-10-30'), card('b', '2026-11-15'))
    expect(reviewForecast(progress, TODAY).every((day) => day.count === 0)).toBe(true)
  })

  it('honours a custom window across a month boundary', () => {
    const progress = progressOf(card('a', '2026-11-01'))
    expect(reviewForecast(progress, '2026-10-30', 3)).toEqual([
      { date: '2026-10-31', count: 0 },
      { date: '2026-11-01', count: 1 },
      { date: '2026-11-02', count: 0 },
    ])
  })
})
