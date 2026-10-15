import { useDeferredValue, useMemo, useState } from 'react'

import { Card } from '@/components/ui'
import { WordFilters, type WordFilter } from '@/components/words/WordFilters'
import { WordRow } from '@/components/words/WordRow'
import { useWords } from '@/hooks/useWords'
import { getWordStatus } from '@/lib/wordStatus'
import { useProgressStore } from '@/stores/progressStore'
import { todayKey } from '@/utils/date'

export function WordsPage() {
  const words = useWords()
  const progress = useProgressStore((state) => state.progress)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<WordFilter>('all')
  const deferredQuery = useDeferredValue(query)
  const today = todayKey()

  const rows = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase()

    return words
      .map((word) => ({ word, status: getWordStatus(progress[word.id], today) }))
      .filter(({ status }) => {
        if (filter === 'learning') return status.kind !== 'not-started'
        if (filter === 'not-started') return status.kind === 'not-started'
        return true
      })
      .filter(
        ({ word }) =>
          !search ||
          word.word.toLowerCase().includes(search) ||
          word.meaning.toLowerCase().includes(search),
      )
  }, [words, progress, today, filter, deferredQuery])

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Word list</h1>
        <p className="mt-1 text-slate-600">
          {words.length} common English words, introduced from most to least common.
        </p>
      </header>

      <WordFilters
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
      />

      <Card className="overflow-hidden p-0">
        {rows.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {rows.map(({ word, status }) => (
              <WordRow key={word.id} word={word} status={status} />
            ))}
          </ul>
        ) : (
          <p className="px-5 py-12 text-center text-sm text-slate-500">No words match.</p>
        )}
      </Card>
    </div>
  )
}
