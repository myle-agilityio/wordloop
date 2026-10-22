import { describe, expect, it } from 'vitest'

import { getStudyStreak } from './streak'

describe('getStudyStreak', () => {
  it('is zero when the user has never studied', () => {
    expect(getStudyStreak([], '2026-10-22')).toEqual({ days: 0, studiedToday: false })
  })

  it('counts consecutive days ending today', () => {
    const days = ['2026-10-20', '2026-10-21', '2026-10-22']
    expect(getStudyStreak(days, '2026-10-22')).toEqual({ days: 3, studiedToday: true })
  })

  it('keeps the streak alive until the user studies today', () => {
    const days = ['2026-10-20', '2026-10-21']
    expect(getStudyStreak(days, '2026-10-22')).toEqual({ days: 2, studiedToday: false })
  })

  it('resets after a missed day', () => {
    const days = ['2026-10-18', '2026-10-19', '2026-10-21', '2026-10-22']
    expect(getStudyStreak(days, '2026-10-22').days).toBe(2)
    expect(getStudyStreak(['2026-10-20'], '2026-10-22').days).toBe(0)
  })

  it('counts across a month boundary', () => {
    const days = ['2026-09-30', '2026-10-01']
    expect(getStudyStreak(days, '2026-10-01').days).toBe(2)
  })

  it('ignores the order of the days and duplicates', () => {
    const days = ['2026-10-22', '2026-10-21', '2026-10-22']
    expect(getStudyStreak(days, '2026-10-22').days).toBe(2)
  })
})
