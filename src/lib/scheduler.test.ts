import { describe, expect, it } from 'vitest'

import type { CardProgress } from '@/types'

import { nextIntervalDays, previewDueOn, scheduleReview } from './scheduler'

describe('nextIntervalDays', () => {
  it('uses the first interval for a new word', () => {
    expect(nextIntervalDays(undefined, 'hard')).toBe(1)
    expect(nextIntervalDays(undefined, 'medium')).toBe(3)
    expect(nextIntervalDays(undefined, 'easy')).toBe(7)
  })

  it('grows the gap each time the word is remembered', () => {
    expect(nextIntervalDays(10, 'medium')).toBe(15)
    expect(nextIntervalDays(10, 'easy')).toBe(25)
  })

  it('never shrinks below the first interval for that rating', () => {
    expect(nextIntervalDays(1, 'medium')).toBe(3)
    expect(nextIntervalDays(1, 'easy')).toBe(7)
  })

  it('resets the gap when the word is hard', () => {
    expect(nextIntervalDays(30, 'hard')).toBe(1)
  })
})

describe('previewDueOn', () => {
  it('previews the first interval for a new word', () => {
    expect(previewDueOn(undefined, '2026-10-15')).toEqual({
      hard: '2026-10-16',
      medium: '2026-10-18',
      easy: '2026-10-22',
    })
  })

  it('previews from the current interval for a word already learned', () => {
    const previous: CardProgress = {
      wordId: 'time',
      learnedOn: '2026-10-01',
      dueOn: '2026-10-08',
      intervalDays: 10,
      reviewCount: 2,
      lastRating: 'medium',
    }

    expect(previewDueOn(previous, '2026-10-08')).toEqual({
      hard: '2026-10-09',
      medium: '2026-10-23',
      easy: '2026-11-02',
    })
  })

  it('matches the due date that rating actually sets', () => {
    const previous: CardProgress = {
      wordId: 'time',
      learnedOn: '2026-10-01',
      dueOn: '2026-10-08',
      intervalDays: 10,
      reviewCount: 2,
      lastRating: 'medium',
    }
    const preview = previewDueOn(previous, '2026-10-08')

    expect(scheduleReview('time', previous, 'medium', '2026-10-08').dueOn).toBe(preview.medium)
    expect(scheduleReview('time', previous, 'easy', '2026-10-08').dueOn).toBe(preview.easy)
  })
})

describe('scheduleReview', () => {
  it('creates progress for a new word', () => {
    expect(scheduleReview('time', undefined, 'medium', '2026-10-15')).toEqual({
      wordId: 'time',
      learnedOn: '2026-10-15',
      dueOn: '2026-10-18',
      intervalDays: 3,
      reviewCount: 1,
      lastRating: 'medium',
    })
  })

  it('keeps the learned date and counts reviews', () => {
    const previous: CardProgress = {
      wordId: 'time',
      learnedOn: '2026-10-01',
      dueOn: '2026-10-08',
      intervalDays: 7,
      reviewCount: 1,
      lastRating: 'easy',
    }
    const next = scheduleReview('time', previous, 'easy', '2026-10-08')

    expect(next.learnedOn).toBe('2026-10-01')
    expect(next.intervalDays).toBe(18)
    expect(next.dueOn).toBe('2026-10-26')
    expect(next.reviewCount).toBe(2)
  })

  it('crosses month and year boundaries', () => {
    expect(scheduleReview('time', undefined, 'easy', '2026-12-28').dueOn).toBe('2027-01-04')
  })
})
