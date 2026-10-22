import type { DateKey } from '@/types'
import { addDays } from '@/utils'

export interface StudyStreak {
  /** Consecutive days studied, ending today or yesterday. */
  days: number
  studiedToday: boolean
}

/** Counts the current streak. Not having studied yet today doesn't break it; missing yesterday does. */
export function getStudyStreak(studyDays: DateKey[], today: DateKey): StudyStreak {
  const studied = new Set(studyDays)
  const studiedToday = studied.has(today)

  let days = 0
  let day = studiedToday ? today : addDays(today, -1)
  while (studied.has(day)) {
    days += 1
    day = addDays(day, -1)
  }

  return { days, studiedToday }
}
