import { useState } from 'react'

import { buildSessionQueue, getDailyPlan } from '@/lib'
import { useProgressStore } from '@/stores'
import type { Rating, Word } from '@/types'
import { todayKey } from '@/utils'

export type RatingTally = Record<Rating, number>

const EMPTY_TALLY: RatingTally = { hard: 0, medium: 0, easy: 0 }

/**
 * Runs one study session. The card queue is fixed when the session starts,
 * so rating a card doesn't reshuffle the cards still to come.
 */
export function useStudySession(words: Word[]) {
  const rateWord = useProgressStore((state) => state.rateWord)

  const [session] = useState(() => {
    const today = todayKey()
    const plan = getDailyPlan(words, useProgressStore.getState().progress, today)
    return { today, queue: buildSessionQueue(plan) }
  })
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [tally, setTally] = useState<RatingTally>(EMPTY_TALLY)

  const { queue, today } = session
  const current = queue.at(index)

  const flip = () => setIsFlipped((flipped) => !flipped)

  const rate = (rating: Rating) => {
    if (!current || !isFlipped) return

    rateWord(current.word.id, rating, today)
    setTally((prev) => ({ ...prev, [rating]: prev[rating] + 1 }))
    setIsFlipped(false)
    setIndex((i) => i + 1)
  }

  return {
    current,
    index,
    total: queue.length,
    isFlipped,
    isComplete: index >= queue.length,
    tally,
    flip,
    rate,
  }
}
