import { create } from 'zustand'

import { deleteAllProgress, fetchProgress, saveProgress } from '@/api/progress'
import { scheduleReview } from '@/lib/scheduler'
import type { DateKey, ProgressMap, Rating } from '@/types'
import { clearLegacyProgress, readLegacyProgress } from '@/utils/legacyProgress'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

interface ProgressState {
  /** The user whose progress is loaded. */
  userId: string | null
  progress: ProgressMap
  status: LoadStatus
  loadError: string | null
  /** Set when a save to the database fails; ratings are kept in memory until a retry succeeds. */
  saveError: string | null

  loadForUser: (userId: string) => Promise<void>
  rateWord: (wordId: string, rating: Rating, today: DateKey) => void
  retrySave: () => Promise<void>
  resetProgress: () => Promise<void>
  clear: () => void
}

const initialState = {
  userId: null,
  progress: {},
  status: 'idle' as LoadStatus,
  loadError: null,
  saveError: null,
}

/** The signed-in user's learning progress, saved in the database. */
export const useProgressStore = create<ProgressState>()((set, get) => ({
  ...initialState,

  loadForUser: async (userId) => {
    const { userId: loadedUserId, status } = get()
    if (loadedUserId === userId && (status === 'loading' || status === 'ready')) return

    set({ ...initialState, userId, status: 'loading' })
    try {
      const progress = await fetchProgress()

      // Move progress studied on this device before accounts existed into the account.
      const legacy = readLegacyProgress()
      const newFromDevice = Object.values(legacy).filter((card) => !progress[card.wordId])
      await saveProgress(userId, newFromDevice)
      clearLegacyProgress()
      for (const card of newFromDevice) progress[card.wordId] = card

      if (get().userId === userId) set({ progress, status: 'ready' })
    } catch (error) {
      if (get().userId === userId) {
        set({ status: 'error', loadError: error instanceof Error ? error.message : String(error) })
      }
    }
  },

  rateWord: (wordId, rating, today) => {
    const { userId, progress } = get()
    if (!userId) return

    const card = scheduleReview(wordId, progress[wordId], rating, today)
    set({ progress: { ...progress, [wordId]: card } })

    saveProgress(userId, [card]).catch((error: unknown) => {
      set({ saveError: error instanceof Error ? error.message : String(error) })
    })
  },

  retrySave: async () => {
    const { userId, progress } = get()
    if (!userId) return

    try {
      await saveProgress(userId, Object.values(progress))
      set({ saveError: null })
    } catch (error) {
      set({ saveError: error instanceof Error ? error.message : String(error) })
    }
  },

  resetProgress: async () => {
    const { userId } = get()
    if (!userId) return

    await deleteAllProgress(userId)
    set({ progress: {}, saveError: null })
  },

  clear: () => set(initialState),
}))
