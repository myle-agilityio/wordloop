import { PartyPopper } from 'lucide-react'
import { Link } from 'react-router'

import { buttonClasses, Card } from '@/components/ui'
import { RATING_OPTIONS, ROUTES } from '@/constants'
import type { RatingTally } from '@/hooks'
import type { Rating } from '@/types'

const tallyColors: Record<Rating, string> = {
  hard: 'text-rose-600',
  medium: 'text-amber-600',
  easy: 'text-emerald-600',
}

interface SessionSummaryProps {
  total: number
  tally: RatingTally
}

export function SessionSummary({ total, tally }: SessionSummaryProps) {
  return (
    <Card className="text-center">
      <PartyPopper className="mx-auto size-12 text-indigo-600" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold">Session complete</h1>
      <p className="mt-2 text-slate-600">
        You studied {total} {total === 1 ? 'word' : 'words'}. Hard words will come back soon, easy
        ones much later.
      </p>

      <dl className="mx-auto mt-8 grid max-w-sm grid-cols-3 gap-3">
        {RATING_OPTIONS.map(({ value, label }) => (
          <div key={value} className="rounded-xl bg-slate-50 p-3">
            <dt className="text-xs font-medium text-slate-500">{label}</dt>
            <dd className={`mt-1 text-2xl font-bold tabular-nums ${tallyColors[value]}`}>
              {tally[value]}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={ROUTES.home} className={buttonClasses('primary', 'md')}>
          Back to today
        </Link>
        <Link to={ROUTES.words} className={buttonClasses('secondary', 'md')}>
          See all words
        </Link>
      </div>
    </Card>
  )
}
