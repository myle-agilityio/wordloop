import type { HTMLAttributes } from 'react'

import { cn } from '@/lib'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800',
        className,
      )}
      {...props}
    />
  )
}
