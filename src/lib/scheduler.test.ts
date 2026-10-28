import { describe, expect, it } from 'vitest'

import { DEFAULT_SETTINGS } from '@/constants'
import type { CardProgress, StudySettings } from '@/types'

import { intervalSequence, nextIntervalDays, previewDueOn, scheduleReview } from './scheduler'

describe('nextIntervalDays', () => {
  it('uses the first interval for a new word', () => {
    expect(nextIntervalDays(undefined, 'hard', DEFAULT_SETTINGS)).toBe(1)
    expect(nextIntervalDays(undefined, 'medium', DEFAULT_SETTINGS)).toBe(3)
    expect(nextIntervalDays(undefined, 'easy', DEFAULT_SETTINGS)).toBe(7)
  })

  it('grows the gap each time the word is remembered', () => {
    expect(nextIntervalDays(10, 'medium', DEFAULT_SETTINGS)).toBe(15)
    expect(nextIntervalDays(10, 'easy', DEFAULT_SETTINGS)).toBe(25)
  })

  it('never shrinks below the first interval for that rating', () => {
    expect(nextIntervalDays(1, 'medium', DEFAULT_SETTINGS)).toBe(3)
    expect(nextIntervalDays(1, 'easy', DEFAULT_SETTINGS)).toBe(7)
  })

  it('resets the gap when the word is hard', () => {
    expect(nextIntervalDays(30, 'hard', DEFAULT_SETTINGS)).toBe(1)
  })
})

describe('previewDueOn', () => {
  it('previews the first interval for a new word', () => {
    expect(previewDueOn(undefined, '2026-10-15', DEFAULT_SETTINGS)).toEqual({
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

    expect(previewDueOn(previous, '2026-10-08', DEFAULT_SETTINGS)).toEqual({
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
    const preview = previewDueOn(previous, '2026-10-08', DEFAULT_SETTINGS)

    expect(scheduleReview('time', previous, 'medium', '2026-10-08', DEFAULT_SETTINGS).dueOn).toBe(
      preview.medium,
    )
    expect(scheduleReview('time', previous, 'easy', '2026-10-08', DEFAULT_SETTINGS).dueOn).toBe(
      preview.easy,
    )
  })
})

describe('scheduleReview', () => {
  it('creates progress for a new word', () => {
    expect(scheduleReview('time', undefined, 'medium', '2026-10-15', DEFAULT_SETTINGS)).toEqual({
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
    const next = scheduleReview('time', previous, 'easy', '2026-10-08', DEFAULT_SETTINGS)

    expect(next.learnedOn).toBe('2026-10-01')
    expect(next.intervalDays).toBe(18)
    expect(next.dueOn).toBe('2026-10-26')
    expect(next.reviewCount).toBe(2)
  })

  it('crosses month and year boundaries', () => {
    expect(scheduleReview('time', undefined, 'easy', '2026-12-28', DEFAULT_SETTINGS).dueOn).toBe(
      '2027-01-04',
    )
  })
})

describe('custom settings', () => {
  const settings: StudySettings = {
    newWordsPerDay: 10,
    firstIntervalDays: { hard: 2, medium: 4, easy: 10 },
    intervalMultiplier: { medium: 2, easy: 3 },
    maxIntervalDays: 60,
  }

  it('uses the custom first intervals and multipliers', () => {
    expect(nextIntervalDays(undefined, 'hard', settings)).toBe(2)
    expect(nextIntervalDays(undefined, 'medium', settings)).toBe(4)
    expect(nextIntervalDays(10, 'medium', settings)).toBe(20)
    expect(nextIntervalDays(10, 'easy', settings)).toBe(30)
    expect(nextIntervalDays(30, 'hard', settings)).toBe(2)
  })

  it('caps the gap at the maximum interval', () => {
    expect(nextIntervalDays(25, 'easy', settings)).toBe(60)
    expect(nextIntervalDays(60, 'medium', settings)).toBe(60)
  })

  it('caps the first interval too when the maximum is lower', () => {
    expect(nextIntervalDays(undefined, 'easy', { ...settings, maxIntervalDays: 5 })).toBe(5)
  })

  it('schedules and previews with the same settings', () => {
    const card = scheduleReview('time', undefined, 'easy', '2026-10-15', settings)
    expect(card.dueOn).toBe('2026-10-25')
    expect(previewDueOn(undefined, '2026-10-15', settings).easy).toBe(card.dueOn)
  })
})

describe('intervalSequence', () => {
  it('lists the gaps for a word rated the same way every time', () => {
    expect(intervalSequence('medium', DEFAULT_SETTINGS)).toEqual([3, 5, 8, 12, 18])
    expect(intervalSequence('hard', DEFAULT_SETTINGS, 3)).toEqual([1, 1, 1])
  })

  it('stops growing at the maximum interval', () => {
    expect(intervalSequence('easy', { ...DEFAULT_SETTINGS, maxIntervalDays: 30 })).toEqual([
      7, 18, 30, 30, 30,
    ])
  })
})
