import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/api', () => ({
  fetchSettings: vi.fn(),
  saveSettings: vi.fn(async () => undefined),
}))

import { fetchSettings, saveSettings } from '@/api'
import { DEFAULT_SETTINGS } from '@/constants'
import type { StudySettings } from '@/types'

import { useSettingsStore } from './settingsStore'

const custom: StudySettings = { ...DEFAULT_SETTINGS, newWordsPerDay: 10, maxIntervalDays: 90 }

describe('settingsStore', () => {
  beforeEach(() => {
    useSettingsStore.getState().clear()
    vi.mocked(fetchSettings).mockReset()
    vi.mocked(saveSettings).mockReset()
  })

  it('loads the user’s saved settings', async () => {
    vi.mocked(fetchSettings).mockResolvedValue(custom)
    await useSettingsStore.getState().loadForUser('user-1')

    expect(useSettingsStore.getState()).toMatchObject({ status: 'ready', settings: custom })
  })

  it('keeps the defaults and reports the error when loading fails', async () => {
    vi.mocked(fetchSettings).mockRejectedValue(new Error('Could not load your settings: offline'))
    await useSettingsStore.getState().loadForUser('user-1')

    const state = useSettingsStore.getState()
    expect(state.status).toBe('error')
    expect(state.loadError).toBe('Could not load your settings: offline')
    expect(state.settings).toEqual(DEFAULT_SETTINGS)
  })

  it('uses new settings only after they are saved', async () => {
    vi.mocked(fetchSettings).mockResolvedValue(DEFAULT_SETTINGS)
    await useSettingsStore.getState().loadForUser('user-1')

    vi.mocked(saveSettings).mockRejectedValueOnce(new Error('Failed to fetch'))
    await expect(useSettingsStore.getState().save(custom)).rejects.toThrow('Failed to fetch')
    expect(useSettingsStore.getState().settings).toEqual(DEFAULT_SETTINGS)

    await useSettingsStore.getState().save(custom)
    expect(saveSettings).toHaveBeenLastCalledWith('user-1', custom)
    expect(useSettingsStore.getState().settings).toEqual(custom)
  })
})
