import { RATING_OPTIONS } from '@/constants'
import { intervalSequence } from '@/lib'
import type { StudySettings } from '@/types'

interface IntervalPreviewProps {
  settings: StudySettings
}

/** Shows the gaps a new word gets when it is rated the same way every time. */
export function IntervalPreview({ settings }: IntervalPreviewProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-sm ring-1 ring-slate-200/70">
      <p className="font-medium text-slate-700">Gaps in days if a word is always rated…</p>
      <dl className="mt-2 grid gap-1">
        {RATING_OPTIONS.map(({ value, label }) => (
          <div key={value} className="flex gap-3">
            <dt className="w-16 text-slate-500">{label}</dt>
            <dd className="tabular-nums">{intervalSequence(value, settings).join(' → ')}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
