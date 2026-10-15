import type { DateKey } from '@/types'

const pad = (value: number) => String(value).padStart(2, '0')

/** Formats a date as a local-time day key (YYYY-MM-DD). */
export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayKey(): DateKey {
  return toDateKey(new Date())
}

function fromDateKey(key: DateKey): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(key: DateKey, days: number): DateKey {
  const date = fromDateKey(key)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

/** Whole days from `from` to `to`. Negative when `to` is earlier. */
export function daysBetween(from: DateKey, to: DateKey): number {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((fromDateKey(to).getTime() - fromDateKey(from).getTime()) / msPerDay)
}

/** Human-friendly label for a due date relative to today, e.g. "today", "tomorrow", "in 5 days". */
export function formatDueLabel(dueOn: DateKey, today: DateKey): string {
  const days = daysBetween(today, dueOn)
  if (days <= 0) return 'today'
  if (days === 1) return 'tomorrow'
  return `in ${days} days`
}
