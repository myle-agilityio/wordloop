import { ArrowRight, CircleCheck } from 'lucide-react'
import { Link } from 'react-router'

import { buttonClasses, Card } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'
import type { DailyPlan } from '@/lib/session'

const plural = (count: number, word: string) => `${count} ${count === 1 ? word : `${word}s`}`

export function TodayCard({ plan }: { plan: DailyPlan }) {
  const reviewCount = plan.reviews.length
  const newCount = plan.newWords.length
  const hasWork = reviewCount + newCount > 0

  if (!hasWork) {
    return (
      <Card className="flex items-center gap-4">
        <CircleCheck className="size-10 shrink-0 text-emerald-500" aria-hidden />
        <div>
          <h2 className="font-semibold">You&apos;re done for today</h2>
          <p className="text-sm text-slate-600">
            Nice work. New words and reviews will be ready tomorrow.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white ring-0">
      <p className="text-sm font-medium text-indigo-100">Today&apos;s session</p>
      <h2 className="mt-1 text-2xl font-bold">
        {[
          reviewCount > 0 && plural(reviewCount, 'review'),
          newCount > 0 && plural(newCount, 'new word'),
        ]
          .filter(Boolean)
          .join(' + ')}
      </h2>
      <p className="mt-2 text-sm text-indigo-100">
        Reviews come first, then today&apos;s new words.
      </p>
      <Link
        to={ROUTES.study}
        className={cn(buttonClasses('secondary', 'lg'), 'mt-6 text-indigo-700 ring-0')}
      >
        Start studying
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </Card>
  )
}
