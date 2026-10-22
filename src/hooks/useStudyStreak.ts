import { useMemo } from 'react'

import { getStudyStreak } from '@/lib'
import { useProgressStore } from '@/stores'
import { todayKey } from '@/utils'

/** The current study streak, recalculated whenever the user studies. */
export function useStudyStreak() {
  const studyDays = useProgressStore((state) => state.studyDays)
  const today = todayKey()

  return useMemo(() => getStudyStreak(studyDays, today), [studyDays, today])
}
