import { Kbd } from '@/components/ui'
import { AGAIN_OPTION, RATING_OPTIONS } from '@/constants'
import { cn } from '@/lib'
import type { Rating } from '@/types'

const buttonClasses = cn(
  'flex flex-col items-center gap-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-colors dark:bg-slate-900 dark:ring-slate-800',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
)

const ratingClasses: Record<Rating, string> = {
  hard: 'hover:bg-rose-50 hover:ring-rose-200 [&_strong]:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:ring-rose-500/40 dark:[&_strong]:text-rose-400',
  medium:
    'hover:bg-amber-50 hover:ring-amber-200 [&_strong]:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:ring-amber-500/40 dark:[&_strong]:text-amber-400',
  easy: 'hover:bg-emerald-50 hover:ring-emerald-200 [&_strong]:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:ring-emerald-500/40 dark:[&_strong]:text-emerald-400',
}

const againClasses =
  'hover:bg-indigo-50 hover:ring-indigo-200 [&_strong]:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:ring-indigo-500/40 dark:[&_strong]:text-indigo-400'

interface RatingButtonsProps {
  /** When the word would be due next for each rating, e.g. "tomorrow". */
  nextDue: Record<Rating, string>
  onRate: (rating: Rating) => void
  onAgain: () => void
}

export function RatingButtons({ nextDue, onRate, onAgain }: RatingButtonsProps) {
  const options = [
    ...RATING_OPTIONS.map((option) => ({
      ...option,
      key: option.value,
      dueLabel: nextDue[option.value],
      onClick: () => onRate(option.value),
      className: ratingClasses[option.value],
    })),
    // Again isn't scheduled; the word comes back before the session ends.
    {
      ...AGAIN_OPTION,
      key: 'again',
      dueLabel: 'this session',
      onClick: onAgain,
      className: againClasses,
    },
  ]

  return (
    <div role="group" aria-label="How well did you remember?" className="grid grid-cols-4 gap-3">
      {options.map(({ key, label, dueLabel, description, shortcut, onClick, className }) => (
        <button key={key} type="button" onClick={onClick} className={cn(buttonClasses, className)}>
          <strong className="text-base font-semibold">{label}</strong>
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Due {dueLabel}
          </span>
          <span className="hidden text-center text-xs text-slate-500 sm:block dark:text-slate-400">
            {description}
          </span>
          <span className="mt-auto hidden pt-1 pointer-fine:block">
            <Kbd>{shortcut}</Kbd>
          </span>
        </button>
      ))}
    </div>
  )
}
