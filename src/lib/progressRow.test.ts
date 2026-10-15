import { describe, expect, it } from 'vitest'

import type { CardProgress } from '@/types'

import { cardToRow, rowsToProgressMap, rowToCard } from './progressRow'

const card: CardProgress = {
  wordId: 'time',
  learnedOn: '2026-10-15',
  dueOn: '2026-10-18',
  intervalDays: 3,
  reviewCount: 1,
  lastRating: 'medium',
}

describe('progress rows', () => {
  it('round-trips a card through a database row', () => {
    const row = cardToRow('user-1', card)

    expect(row.user_id).toBe('user-1')
    expect(row.word_id).toBe('time')
    expect(rowToCard(row)).toEqual(card)
  })

  it('builds a progress map keyed by word', () => {
    expect(rowsToProgressMap([cardToRow('user-1', card)])).toEqual({ time: card })
  })
})
