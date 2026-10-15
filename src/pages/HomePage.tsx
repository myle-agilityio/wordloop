import { BookOpenCheck, CalendarCheck, Sparkles } from 'lucide-react'

import { StatCard } from '@/components/home/StatCard'
import { TodayCard } from '@/components/home/TodayCard'
import { Button, ProgressBar } from '@/components/ui'
import { NEW_WORDS_PER_DAY } from '@/constants/srs'
import { useDailyPlan } from '@/hooks/useDailyPlan'
import { useWords } from '@/hooks/useWords'
import { useProgressStore } from '@/stores/progressStore'

export function HomePage() {
  const words = useWords()
  const plan = useDailyPlan(words)
  const progress = useProgressStore((state) => state.progress)
  const resetProgress = useProgressStore((state) => state.resetProgress)

  const learnedCount = Object.keys(progress).length

  const handleReset = async () => {
    if (!window.confirm('Reset all progress? This removes every word you have studied.')) return
    try {
      await resetProgress()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Could not reset your progress.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Today</h1>
        <p className="mt-1 text-slate-600">
          Learn {NEW_WORDS_PER_DAY} new words a day and review the ones you&apos;ve learned.
        </p>
      </header>

      <TodayCard plan={plan} />

      <section aria-label="Your progress" className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={BookOpenCheck}
          label="Words learned"
          value={learnedCount}
          hint={
            <>
              <ProgressBar value={learnedCount} max={words.length} label="Words learned" />
              <span className="mt-2 block">of {words.length} words</span>
            </>
          }
        />
        <StatCard
          icon={Sparkles}
          label="New today"
          value={`${plan.newLearnedToday} / ${NEW_WORDS_PER_DAY}`}
          hint="New words learned today"
        />
        <StatCard
          icon={CalendarCheck}
          label="Due for review"
          value={plan.reviews.length}
          hint="Words to review today"
        />
      </section>

      {learnedCount > 0 && (
        <div className="flex justify-end">
          <Button variant="danger" size="sm" onClick={handleReset}>
            Reset progress
          </Button>
        </div>
      )}
    </div>
  )
}
