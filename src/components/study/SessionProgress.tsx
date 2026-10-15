import { X } from 'lucide-react'
import { Link } from 'react-router'

import { ProgressBar } from '@/components/ui'
import { ROUTES } from '@/constants/routes'

interface SessionProgressProps {
  done: number
  total: number
}

export function SessionProgress({ done, total }: SessionProgressProps) {
  return (
    <div className="flex items-center gap-4">
      <Link
        to={ROUTES.home}
        aria-label="End session"
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        <X className="size-5" aria-hidden />
      </Link>
      <ProgressBar value={done} max={total} label="Session progress" />
      <span className="shrink-0 text-sm font-medium text-slate-500 tabular-nums">
        {done} / {total}
      </span>
    </div>
  )
}
