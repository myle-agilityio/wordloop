import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/api', () => ({
  fetchProgress: vi.fn(async () => ({})),
  saveProgress: vi.fn(async () => undefined),
  deleteAllProgress: vi.fn(),
  fetchStudyDays: vi.fn(async () => []),
  saveStudyDays: vi.fn(async () => undefined),
  deleteAllStudyDays: vi.fn(),
}))

import { deleteAllStudyDays, saveProgress, saveStudyDays } from '@/api'

import { useProgressStore } from './progressStore'
import { useSettingsStore } from './settingsStore'

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

const savedWordIds = (calls: Parameters<typeof saveProgress>[]) =>
  calls.flatMap(([, cards]) => cards.map((card) => card.wordId))

describe('progressStore', () => {
  const save = vi.mocked(saveProgress)

  beforeEach(async () => {
    useProgressStore.getState().clear()
    // loadForUser also calls saveProgress once, to move progress saved on the device before accounts existed.
    await useProgressStore.getState().loadForUser('user-1')
    save.mockClear()
    vi.mocked(saveStudyDays).mockClear()
  })

  it('eventually saves a rating made while offline', async () => {
    save.mockRejectedValueOnce(new Error('Failed to fetch')) // offline
    useProgressStore.getState().rateWord('time', 'easy', '2026-10-15')
    await flush()
    useProgressStore.getState().rateWord('person', 'medium', '2026-10-15') // back online
    await flush()

    expect(savedWordIds(save.mock.calls.slice(1))).toContain('time')
    expect(useProgressStore.getState().saveError).toBeNull()
  })

  it('keeps the warning while a rating is still unsaved', async () => {
    save.mockRejectedValue(new Error('Failed to fetch')) // stays offline
    useProgressStore.getState().rateWord('time', 'easy', '2026-10-15')
    await flush()
    useProgressStore.getState().rateWord('person', 'medium', '2026-10-15')
    await flush()

    const state = useProgressStore.getState()
    expect(state.saveError).toBe('Failed to fetch')
    expect(state.unsavedWordIds).toEqual(['time', 'person'])
    save.mockReset()
  })

  it('Retry saves only the unsaved ratings and clears the warning', async () => {
    useProgressStore.getState().rateWord('person', 'medium', '2026-10-15') // saved
    await flush()
    save.mockRejectedValueOnce(new Error('Failed to fetch'))
    useProgressStore.getState().rateWord('time', 'easy', '2026-10-15') // not saved
    await flush()
    save.mockClear()

    await useProgressStore.getState().retrySave()

    expect(savedWordIds(save.mock.calls)).toEqual(['time'])
    expect(useProgressStore.getState().saveError).toBeNull()
    expect(useProgressStore.getState().unsavedWordIds).toEqual([])
  })

  it('keeps a word unsaved if it was rated again while its save was in flight', async () => {
    let finishFirstSave = () => {}
    save.mockImplementationOnce(
      () => new Promise<void>((resolve) => (finishFirstSave = () => resolve())),
    )
    useProgressStore.getState().rateWord('time', 'hard', '2026-10-15')
    save.mockRejectedValueOnce(new Error('Failed to fetch'))
    useProgressStore.getState().rateWord('time', 'easy', '2026-10-15') // newer card, save fails
    await flush()

    finishFirstSave() // the older card's save succeeds
    await flush()

    expect(useProgressStore.getState().unsavedWordIds).toEqual(['time'])
    expect(useProgressStore.getState().saveError).toBe('Failed to fetch')
  })

  it('records the first rating of a day as a study day, once', async () => {
    for (const [wordId, day] of [
      ['time', '2026-10-15'],
      ['person', '2026-10-15'],
      ['year', '2026-10-16'],
    ]) {
      useProgressStore.getState().rateWord(wordId, 'easy', day)
      await flush()
    }

    const savedDays = vi.mocked(saveStudyDays).mock.calls.flatMap(([, days]) => days)
    expect(savedDays).toEqual(['2026-10-15', '2026-10-16'])
    expect(useProgressStore.getState().studyDays).toEqual(['2026-10-15', '2026-10-16'])
    expect(useProgressStore.getState().unsavedStudyDays).toEqual([])
  })

  it('keeps a study day unsaved until a save succeeds', async () => {
    vi.mocked(saveStudyDays).mockRejectedValueOnce(new Error('Failed to fetch'))
    useProgressStore.getState().rateWord('time', 'easy', '2026-10-15')
    await flush()
    expect(useProgressStore.getState().unsavedStudyDays).toEqual(['2026-10-15'])

    await useProgressStore.getState().retrySave()

    expect(useProgressStore.getState().unsavedStudyDays).toEqual([])
    expect(useProgressStore.getState().saveError).toBeNull()
  })

  it('resetProgress clears the study days too', async () => {
    useProgressStore.getState().rateWord('time', 'easy', '2026-10-15')
    await flush()

    await useProgressStore.getState().resetProgress()

    expect(deleteAllStudyDays).toHaveBeenCalledWith('user-1')
    expect(useProgressStore.getState().studyDays).toEqual([])
    expect(useProgressStore.getState().unsavedStudyDays).toEqual([])
  })

  it('schedules ratings with the user’s settings', () => {
    useSettingsStore.setState({
      settings: {
        newWordsPerDay: 5,
        firstIntervalDays: { hard: 2, medium: 4, easy: 10 },
        intervalMultiplier: { medium: 1.5, easy: 2.5 },
        maxIntervalDays: 365,
      },
    })
    useProgressStore.getState().rateWord('time', 'easy', '2026-10-15')

    expect(useProgressStore.getState().progress.time.dueOn).toBe('2026-10-25')
    useSettingsStore.getState().clear()
  })
})
