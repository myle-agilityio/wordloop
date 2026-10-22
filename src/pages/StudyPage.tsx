import { Flashcard } from '@/components/flashcard/Flashcard'
import { RatingButtons } from '@/components/flashcard/RatingButtons'
import { AllCaughtUp } from '@/components/study/AllCaughtUp'
import { SessionProgress } from '@/components/study/SessionProgress'
import { SessionSummary } from '@/components/study/SessionSummary'
import { Button, Kbd } from '@/components/ui'
import { useKeyboardShortcuts, useStudySession, useWords } from '@/hooks'

export function StudyPage() {
  const words = useWords()
  const {
    current,
    index,
    total,
    wordCount,
    isFlipped,
    isComplete,
    tally,
    againCount,
    nextDue,
    flip,
    rate,
    again,
  } = useStudySession(words)

  useKeyboardShortcuts({
    ' ': flip,
    '1': () => rate('hard'),
    '2': () => rate('medium'),
    '3': () => rate('easy'),
    '4': again,
  })

  if (total === 0) return <AllCaughtUp />
  if (isComplete || !current) {
    return <SessionSummary wordCount={wordCount} tally={tally} againCount={againCount} />
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <SessionProgress done={index} total={total} />

      {/* Keyed by position: the same word can come back right away after Again. */}
      <Flashcard key={index} {...current} isFlipped={isFlipped} onFlip={flip} />

      <div aria-live="polite">
        {isFlipped ? (
          <div className="flex flex-col gap-3">
            <p className="text-center text-sm font-medium text-slate-600">
              How well did you remember it?
            </p>
            <RatingButtons nextDue={nextDue} onRate={rate} onAgain={again} />
          </div>
        ) : (
          <Button size="lg" className="w-full" onClick={flip}>
            Show meaning
            <span className="hidden sm:inline">
              <Kbd>Space</Kbd>
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}
