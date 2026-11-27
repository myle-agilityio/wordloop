import { Badge } from '@/components/ui'
import type { WordStatus } from '@/lib'
import type { Word } from '@/types'

interface WordRowProps {
  word: Word
  status: WordStatus
}

export function WordRow({ word, status }: WordRowProps) {
  return (
    <li className="flex items-center gap-4 px-5 py-4">
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
