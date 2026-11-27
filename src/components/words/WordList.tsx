import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useLayoutEffect, useRef, useState } from 'react'

import type { WordStatus } from '@/lib'
import type { Word } from '@/types'

import { WordRow } from './WordRow'

interface WordListProps {
  rows: { word: Word; status: WordStatus }[]
}

// A row with a two-line word and meaning; real heights are measured after render
const ESTIMATED_ROW_HEIGHT = 73

/** Renders only the rows near the viewport, so the page stays fast with thousands of words. */
export function WordList({ rows }: WordListProps) {
  const listRef = useRef<HTMLUListElement>(null)
  const [scrollMargin, setScrollMargin] = useState(0)

  // The window scrolls, so the virtualizer needs the list's distance from the top of the page
  useLayoutEffect(() => {
    const measure = () => {
      const top = listRef.current?.getBoundingClientRect().top ?? 0
      setScrollMargin(top + window.scrollY)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 10,
    scrollMargin,
    getItemKey: (index) => rows[index].word.id,
  })

  return (
    <ul ref={listRef} className="relative" style={{ height: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((item) => {
        const { word, status } = rows[item.index]
        return (
          <WordRow
            key={item.key}
            ref={virtualizer.measureElement}
            data-index={item.index}
            word={word}
            status={status}
            className="absolute top-0 left-0 w-full"
            style={{ transform: `translateY(${item.start - scrollMargin}px)` }}
            hasDivider={item.index > 0}
          />
        )
      })}
    </ul>
  )
}
