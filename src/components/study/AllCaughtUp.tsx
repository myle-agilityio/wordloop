import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router'

import { buttonClasses, Card } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'

export function AllCaughtUp() {
  return (
    <Card className="text-center">
      <CircleCheck className="mx-auto size-12 text-emerald-500" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold">All caught up</h1>
      <p className="mt-2 text-slate-600">
        No reviews are due and you&apos;ve learned today&apos;s new words. Come back tomorrow.
      </p>
      <Link to={ROUTES.home} className={cn(buttonClasses('secondary', 'md'), 'mt-8')}>
        Back to today
      </Link>
    </Card>
  )
}
