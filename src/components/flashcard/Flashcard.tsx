import { RotateCcw } from 'lucide-react'

import { Badge, Kbd } from '@/components/ui'
import { cn, type SessionCardKind } from '@/lib'
import type { Word } from '@/types'

interface FlashcardProps {
  word: Word
  kind: SessionCardKind
  isRepeat?: boolean
  isFlipped: boolean
  onFlip: () => void
}

const faceClasses =
  'col-start-1 row-start-1 flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/70 backface-hidden'

/**
 * A two-sided card: the word on the front, the meaning and examples on the back.
 * Render it with a key per queue position so a new card starts face up without animating.
 */
export function Flashcard({ word, kind, isRepeat, isFlipped, onFlip }: FlashcardProps) {
  return (
    <button
      type="button"
      onClick={onFlip}
      aria-label={isFlipped ? `Hide meaning of ${word.word}` : `Show meaning of ${word.word}`}
      className="block w-full rounded-3xl text-left perspective-distant focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600"
    >
      <span
        className={cn(
          'grid min-h-80 transition-transform duration-500 transform-3d motion-reduce:transition-none',
          isFlipped && 'rotate-y-180',
        )}
      >
        {/* Front */}
        <span className={faceClasses} aria-hidden={isFlipped}>
          <span className="flex gap-2 self-start">
            <Badge tone={kind === 'new' ? 'indigo' : 'amber'}>
              {kind === 'new' ? 'New word' : 'Review'}
            </Badge>
            {isRepeat && <Badge tone="rose">Again</Badge>}
          </span>
          <span className="flex flex-1 flex-col items-center justify-center gap-2 py-8">
            <span className="text-5xl font-bold tracking-tight text-slate-900">{word.word}</span>
            <span className="text-sm text-slate-500 italic">{word.partOfSpeech}</span>
          </span>
          <span className="flex items-center justify-center gap-2 text-xs text-slate-400">
            Tap the card or press <Kbd>Space</Kbd> to see the meaning
          </span>
        </span>

        {/* Back */}
        <span className={cn(faceClasses, 'rotate-y-180')} aria-hidden={!isFlipped}>
          <span className="flex items-baseline justify-between gap-4">
            <span>
              <span className="text-2xl font-bold text-slate-900">{word.word}</span>{' '}
              <span className="text-sm text-slate-500 italic">{word.partOfSpeech}</span>
            </span>
            <RotateCcw className="size-4 shrink-0 text-slate-300" aria-hidden />
          </span>
          <span className="mt-4 block text-lg text-slate-800">{word.meaning}</span>
          <span className="mt-6 block text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Examples
          </span>
          <span className="mt-2 flex flex-col gap-2">
            {word.examples.map((example) => (
              <span
                key={example}
                className="block border-l-2 border-indigo-200 pl-3 text-slate-600 italic"
              >
                {example}
              </span>
            ))}
          </span>
        </span>
      </span>
    </button>
  )
}
