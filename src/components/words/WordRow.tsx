import type { ComponentProps } from 'react'

import { Badge } from '@/components/ui'
import { cn, type WordStatus } from '@/lib'
import type { Word } from '@/types'

interface WordRowProps extends ComponentProps<'li'> {
  word: Word
  status: WordStatus
  hasDivider?: boolean
}

export function WordRow({ word, status, hasDivider, className, ...props }: WordRowProps) {
  return (
    <li
      className={cn(
        'flex items-center gap-4 px-5 py-4',
        hasDivider && 'border-t border-slate-100 dark:border-slate-800',
        className,
      )}
      {...props}
    >
      <span className="w-8 shrink-0 text-right text-xs text-slate-400 tabular-nums">
        {word.rank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          {word.word}{' '}
          <span className="text-sm font-normal text-slate-400">
            {word.ipa} · <span className="italic">{word.partOfSpeech}</span>
          </span>
        </p>
        <p className="truncate text-sm text-slate-500 dark:text-slate-400">{word.meaning}</p>
      </div>
      <Badge tone={status.tone} className="shrink-0">
        {status.label}
      </Badge>
    </li>
  )
}
