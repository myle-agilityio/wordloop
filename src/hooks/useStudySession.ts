import { useState } from 'react'

import { buildSessionQueue, getDailyPlan, previewDueOn, sendCardAgain } from '@/lib'
import { useProgressStore } from '@/stores'
import type { Rating, Word } from '@/types'
import { formatDueLabel, todayKey } from '@/utils'

export type RatingTally = Record<Rating, number>

const EMPTY_TALLY: RatingTally = { hard: 0, medium: 0, easy: 0 }

/**
 * Runs one study session. The card queue is fixed when the session starts, so rating a card
 * doesn't reshuffle the cards still to come; Again only adds a repeat to the end.
 */
export function useStudySession(words: Word[]) {
  const rateWord = useProgressStore((state) => state.rateWord)
  const progress = useProgressStore((state) => state.progress)

  const [session] = useState(() => {
    const today = todayKey()
    const plan = getDailyPlan(words, useProgressStore.getState().progress, today)
    return { today, queue: buildSessionQueue(plan) }
  })
  const [queue, setQueue] = useState(session.queue)
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [tally, setTally] = useState<RatingTally>(EMPTY_TALLY)
  const [againCount, setAgainCount] = useState(0)

  const { today } = session
  const current = queue.at(index)

  // Labels for what each rating would do to the current word, shown before it's rated.
  const dueOn = previewDueOn(current ? progress[current.word.id] : undefined, today)
  const nextDue: Record<Rating, string> = {
    hard: formatDueLabel(dueOn.hard, today),
    medium: formatDueLabel(dueOn.medium, today),
    easy: formatDueLabel(dueOn.easy, today),
  }

  const flip = () => setIsFlipped((flipped) => !flipped)

  const rate = (rating: Rating) => {
    if (!current || !isFlipped) return

    rateWord(current.word.id, rating, today)
    setTally((prev) => ({ ...prev, [rating]: prev[rating] + 1 }))
    setIsFlipped(false)
    setIndex((i) => i + 1)
  }

  // Not a rating: nothing is scheduled or saved until the word is rated.
  const again = () => {
    if (!current || !isFlipped) return

    setQueue((prev) => sendCardAgain(prev, index))
    setAgainCount((count) => count + 1)
    setIsFlipped(false)
    setIndex((i) => i + 1)
  }

  return {
    current,
    index,
    total: queue.length,
    wordCount: session.queue.length,
    isFlipped,
    isComplete: index >= queue.length,
    tally,
    againCount,
    nextDue,
    flip,
    rate,
    again,
  }
}
