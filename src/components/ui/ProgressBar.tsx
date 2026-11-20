import { cn } from '@/lib'

interface ProgressBarProps {
  value: number
  max: number
  label: string
  className?: string
}

export function ProgressBar({ value, max, label, className }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800',
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-indigo-600 transition-[width] duration-300 dark:bg-indigo-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
