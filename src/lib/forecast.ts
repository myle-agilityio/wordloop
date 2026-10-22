import type { DateKey, ProgressMap } from '@/types'
import { addDays } from '@/utils'

export interface ForecastDay {
  date: DateKey
  count: number
}

/** Reviews due on each of the next `days` days, tomorrow first. Today and overdue cards are left out. */
export function reviewForecast(progress: ProgressMap, today: DateKey, days = 7): ForecastDay[] {
  const forecast = Array.from({ length: days }, (_, index) => ({
    date: addDays(today, index + 1),
    count: 0,
  }))
  const byDate = new Map(forecast.map((day) => [day.date, day]))

  for (const card of Object.values(progress)) {
    const day = byDate.get(card.dueOn)
    if (day) day.count += 1
  }

  return forecast
}
