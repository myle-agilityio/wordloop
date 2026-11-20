import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card } from '@/components/ui'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: ReactNode
  hint?: ReactNode
}

export function StatCard({ icon: Icon, label, value, hint }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Icon className="size-4" aria-hidden />
        {label}
      </div>
      <div className="mt-2 text-3xl font-bold tabular-nums">{value}</div>
      {hint && <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">{hint}</div>}
    </Card>
  )
}
