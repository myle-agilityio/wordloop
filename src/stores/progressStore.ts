import { create } from 'zustand'

import {
  deleteAllProgress,
  deleteAllStudyDays,
  fetchProgress,
  fetchStudyDays,
  saveProgress,
  saveStudyDays,
} from '@/api'
import { scheduleReview } from '@/lib'
import type { DateKey, ProgressMap, Rating } from '@/types'
import { clearLegacyProgress, readLegacyProgress } from '@/utils'

import { useSettingsStore } from './settingsStore'

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

interface ProgressState {
  /** The user whose progress is loaded. */
  userId: string | null
  progress: ProgressMap
  status: LoadStatus
  loadError: string | null
  /** Words rated since their last successful save. They're sent again with every save until one succeeds. */
  unsavedWordIds: string[]
  /** Days the user studied, used for the streak. */
  studyDays: DateKey[]
  /** Study days not saved yet. Sent again with every save, like `unsavedWordIds`. */
  unsavedStudyDays: DateKey[]
  /** Set when a save to the database fails; cleared once every rating and study day is saved. */
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
  studyDays: [] as DateKey[],
  unsavedStudyDays: [] as DateKey[],
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
      const [progress, studyDays] = await Promise.all([fetchProgress(), fetchStudyDays()])

      // Move progress studied on this device before accounts existed into the account.
      const legacy = readLegacyProgress()
      const newFromDevice = Object.values(legacy).filter((card) => !progress[card.wordId])
      await saveProgress(userId, newFromDevice)
      clearLegacyProgress()
      for (const card of newFromDevice) progress[card.wordId] = card

      if (get().userId === userId) set({ progress, studyDays, status: 'ready' })
    } catch (error) {
      if (get().userId === userId) {
        set({ status: 'error', loadError: errorMessage(error) })
      }
    }
  },

  rateWord: (wordId, rating, today) => {
    const { userId, progress, unsavedWordIds, studyDays, unsavedStudyDays } = get()
    if (!userId) return

    const { settings } = useSettingsStore.getState()
    const card = scheduleReview(wordId, progress[wordId], rating, today, settings)
    const isNewStudyDay = !studyDays.includes(today)
    set({
      progress: { ...progress, [wordId]: card },
      unsavedWordIds: unsavedWordIds.includes(wordId)
        ? unsavedWordIds
        : [...unsavedWordIds, wordId],
      ...(isNewStudyDay && {
        studyDays: [...studyDays, today],
        unsavedStudyDays: [...unsavedStudyDays, today],
      }),
    })

    void get().retrySave()
  },

  retrySave: async () => {
    const { userId, progress, unsavedWordIds, unsavedStudyDays } = get()
    if (!userId || unsavedWordIds.length + unsavedStudyDays.length === 0) return

    const cards = unsavedWordIds.map((id) => progress[id])
    const days = unsavedStudyDays
    try {
      await Promise.all([saveProgress(userId, cards), saveStudyDays(userId, days)])
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
    const stillUnsavedDays = current.unsavedStudyDays.filter((day) => !days.includes(day))
    set({
      unsavedWordIds: stillUnsaved,
      unsavedStudyDays: stillUnsavedDays,
      saveError: stillUnsaved.length + stillUnsavedDays.length === 0 ? null : current.saveError,
    })
  },

  resetProgress: async () => {
    const { userId } = get()
    if (!userId) return

    await Promise.all([deleteAllProgress(userId), deleteAllStudyDays(userId)])
    set({
      progress: {},
      unsavedWordIds: [],
      studyDays: [],
      unsavedStudyDays: [],
      saveError: null,
    })
  },

  clear: () => set(initialState),
}))
