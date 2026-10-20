import { useMemo } from 'react'

import { getDailyPlan } from '@/lib'
import { useProgressStore } from '@/stores'
import type { Word } from '@/types'
import { todayKey } from '@/utils'

/** Today's reviews and new words, recalculated whenever progress changes. */
export function useDailyPlan(words: Word[]) {
  const progress = useProgressStore((state) => state.progress)
  const today = todayKey()

  return useMemo(() => getDailyPlan(words, progress, today), [words, progress, today])
}
