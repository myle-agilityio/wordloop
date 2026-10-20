import { Search } from 'lucide-react'

import { cn } from '@/lib'

export type WordFilter = 'all' | 'learning' | 'not-started'

const FILTERS: { value: WordFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'learning', label: 'Learning' },
  { value: 'not-started', label: 'Not started' },
]

interface WordFiltersProps {
  query: string
  onQueryChange: (query: string) => void
  filter: WordFilter
  onFilterChange: (filter: WordFilter) => void
}

export function WordFilters({ query, onQueryChange, filter, onFilterChange }: WordFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative flex-1">
        <span className="sr-only">Search words</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search words or meanings"
          className="h-10 w-full rounded-xl bg-white pr-3 pl-9 text-sm shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
        />
      </label>

      <div role="radiogroup" aria-label="Filter words" className="flex rounded-xl bg-slate-100 p-1">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={filter === value}
            onClick={() => onFilterChange(value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              filter === value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
