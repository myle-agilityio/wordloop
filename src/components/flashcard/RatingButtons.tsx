import { Kbd } from '@/components/ui'
import { AGAIN_OPTION, RATING_OPTIONS } from '@/constants'
import { cn } from '@/lib'
import type { Rating } from '@/types'

const buttonClasses = cn(
  'flex flex-col items-center gap-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
)

const ratingClasses: Record<Rating, string> = {
  hard: 'hover:bg-rose-50 hover:ring-rose-200 [&_strong]:text-rose-600',
  medium: 'hover:bg-amber-50 hover:ring-amber-200 [&_strong]:text-amber-600',
  easy: 'hover:bg-emerald-50 hover:ring-emerald-200 [&_strong]:text-emerald-600',
}

const againClasses = 'hover:bg-indigo-50 hover:ring-indigo-200 [&_strong]:text-indigo-600'

interface RatingButtonsProps {
  onRate: (rating: Rating) => void
  onAgain: () => void
}

export function RatingButtons({ onRate, onAgain }: RatingButtonsProps) {
  const options = [
    ...RATING_OPTIONS.map((option) => ({
      ...option,
      key: option.value,
      onClick: () => onRate(option.value),
      className: ratingClasses[option.value],
    })),
    { ...AGAIN_OPTION, key: 'again', onClick: onAgain, className: againClasses },
  ]

  return (
    <div role="group" aria-label="How well did you remember?" className="grid grid-cols-4 gap-3">
      {options.map(({ key, label, description, shortcut, onClick, className }) => (
        <button key={key} type="button" onClick={onClick} className={cn(buttonClasses, className)}>
          <strong className="text-base font-semibold">{label}</strong>
          <span className="hidden text-center text-xs text-slate-500 sm:block">{description}</span>
          <span className="mt-auto hidden pt-1 sm:block">
            <Kbd>{shortcut}</Kbd>
          </span>
        </button>
      ))}
    </div>
  )
}
