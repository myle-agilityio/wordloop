import { Kbd } from '@/components/ui'
import { RATING_OPTIONS } from '@/constants/ratings'
import { cn } from '@/lib/cn'
import type { Rating } from '@/types'

const ratingClasses: Record<Rating, string> = {
  hard: 'hover:bg-rose-50 hover:ring-rose-200 [&_strong]:text-rose-600',
  medium: 'hover:bg-amber-50 hover:ring-amber-200 [&_strong]:text-amber-600',
  easy: 'hover:bg-emerald-50 hover:ring-emerald-200 [&_strong]:text-emerald-600',
}

interface RatingButtonsProps {
  onRate: (rating: Rating) => void
}

export function RatingButtons({ onRate }: RatingButtonsProps) {
  return (
    <div role="group" aria-label="How well did you remember?" className="grid grid-cols-3 gap-3">
      {RATING_OPTIONS.map(({ value, label, description, shortcut }) => (
        <button
          key={value}
          type="button"
          onClick={() => onRate(value)}
          className={cn(
            'flex flex-col items-center gap-1 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            ratingClasses[value],
          )}
        >
          <strong className="text-base font-semibold">{label}</strong>
          <span className="hidden text-center text-xs text-slate-500 sm:block">{description}</span>
          <span className="mt-1 hidden sm:block">
            <Kbd>{shortcut}</Kbd>
          </span>
        </button>
      ))}
    </div>
  )
}
