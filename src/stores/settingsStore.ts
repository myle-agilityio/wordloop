import { create } from 'zustand'

import { fetchSettings, saveSettings } from '@/api'
import { DEFAULT_SETTINGS } from '@/constants'
import type { StudySettings } from '@/types'

import type { LoadStatus } from './progressStore'

interface SettingsState {
  /** The user whose settings are loaded. */
  userId: string | null
  settings: StudySettings
  status: LoadStatus
  loadError: string | null

  loadForUser: (userId: string) => Promise<void>
  /** Saves the settings to the database, then uses them. Throws if the save fails. */
  save: (settings: StudySettings) => Promise<void>
  clear: () => void
}

const initialState = {
  userId: null,
  settings: DEFAULT_SETTINGS,
  status: 'idle' as LoadStatus,
  loadError: null,
}

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error))

/** The signed-in user's review settings, saved in the database. */
export const useSettingsStore = create<SettingsState>()((set, get) => ({
  ...initialState,

  loadForUser: async (userId) => {
    const { userId: loadedUserId, status } = get()
    if (loadedUserId === userId && (status === 'loading' || status === 'ready')) return

    set({ ...initialState, userId, status: 'loading' })
    try {
      const settings = await fetchSettings()
      if (get().userId === userId) set({ settings, status: 'ready' })
    } catch (error) {
      if (get().userId === userId) set({ status: 'error', loadError: errorMessage(error) })
    }
  },

  save: async (settings) => {
    const { userId } = get()
    if (!userId) return

    await saveSettings(userId, settings)
    if (get().userId === userId) set({ settings })
  },

  clear: () => set(initialState),
}))
