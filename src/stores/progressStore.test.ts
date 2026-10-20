import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/api', () => ({
  fetchProgress: vi.fn(async () => ({})),
  saveProgress: vi.fn(async () => undefined),
  deleteAllProgress: vi.fn(),
}))

import { saveProgress } from '@/api'

import { useProgressStore } from './progressStore'

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
})
