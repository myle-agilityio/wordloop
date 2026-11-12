import { useMemo } from 'react'

import { getDailyPlan } from '@/lib'
import { useProgressStore, useSettingsStore } from '@/stores'
import type { Word } from '@/types'
import { todayKey } from '@/utils'

/** Today's reviews and new words, recalculated whenever progress or the daily limit changes. */
export function useDailyPlan(words: Word[]) {
  const progress = useProgressStore((state) => state.progress)
  const newWordsPerDay = useSettingsStore((state) => state.settings.newWordsPerDay)
  const today = todayKey()

  return useMemo(
    () => getDailyPlan(words, progress, today, newWordsPerDay),
    [words, progress, today, newWordsPerDay],
  )
}
