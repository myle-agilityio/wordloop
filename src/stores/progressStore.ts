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
  /** Words rated since their last successful save. They're sent again with every save until one succeeds. */
  unsavedWordIds: string[]
  /** Set when a save to the database fails; cleared once every rating is saved. */
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
  unsavedWordIds: [] as string[],
  saveError: null,
}

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error))

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
        set({ status: 'error', loadError: errorMessage(error) })
      }
    }
  },

  rateWord: (wordId, rating, today) => {
    const { userId, progress, unsavedWordIds } = get()
    if (!userId) return

    const card = scheduleReview(wordId, progress[wordId], rating, today)
    set({
      progress: { ...progress, [wordId]: card },
      unsavedWordIds: unsavedWordIds.includes(wordId)
        ? unsavedWordIds
        : [...unsavedWordIds, wordId],
    })

    void get().retrySave()
  },

  retrySave: async () => {
    const { userId, progress, unsavedWordIds } = get()
    if (!userId || unsavedWordIds.length === 0) return

    const cards = unsavedWordIds.map((id) => progress[id])
    try {
      await saveProgress(userId, cards)
    } catch (error) {
      if (get().userId === userId) set({ saveError: errorMessage(error) })
      return
    }

    // A word rated again while this save was in flight still needs its newer card saved.
    const current = get()
    if (current.userId !== userId) return
    const stillUnsaved = current.unsavedWordIds.filter(
      (id) => !cards.includes(current.progress[id]),
    )
    set({
      unsavedWordIds: stillUnsaved,
      saveError: stillUnsaved.length === 0 ? null : current.saveError,
    })
  },

  resetProgress: async () => {
    const { userId } = get()
    if (!userId) return

    await deleteAllProgress(userId)
    set({ progress: {}, unsavedWordIds: [], saveError: null })
  },

  clear: () => set(initialState),
}))
