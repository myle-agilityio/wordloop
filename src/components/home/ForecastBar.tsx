import type { ForecastDay } from '@/lib'
import { formatWeekday } from '@/utils'

interface ForecastBarProps {
  day: ForecastDay
  /** The largest count in the forecast, so bars share one scale. */
  max: number
}

export function ForecastBar({ day, max }: ForecastBarProps) {
  const weekday = formatWeekday(day.date)
  const height = max > 0 ? (day.count / max) * 100 : 0

  return (
    <li
      className="flex flex-1 flex-col items-center gap-1"
      aria-label={`${weekday}: ${day.count} ${day.count === 1 ? 'review' : 'reviews'}`}
    >
      <span className="text-xs font-medium text-slate-700 tabular-nums">{day.count}</span>
      <div className="flex h-20 w-full items-end rounded-md bg-slate-100">
        <div className="w-full rounded-md bg-indigo-500" style={{ height: `${height}%` }} />
      </div>
      <span className="text-xs text-slate-500">{weekday}</span>
    </li>
  )
}
