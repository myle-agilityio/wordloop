import { BookOpenCheck, CalendarCheck, Flame, Sparkles } from 'lucide-react'
import { useMemo } from 'react'

import { ReviewForecastCard } from '@/components/home/ReviewForecastCard'
import { StatCard } from '@/components/home/StatCard'
import { TodayCard } from '@/components/home/TodayCard'
import { Button, ProgressBar } from '@/components/ui'
import { useDailyPlan, useStudyStreak, useWords } from '@/hooks'
import { reviewForecast } from '@/lib'
import { useProgressStore, useSettingsStore } from '@/stores'
import { todayKey } from '@/utils'

export function HomePage() {
  const words = useWords()
  const plan = useDailyPlan(words)
  const streak = useStudyStreak()
  const progress = useProgressStore((state) => state.progress)
  const resetProgress = useProgressStore((state) => state.resetProgress)
  const newWordsPerDay = useSettingsStore((state) => state.settings.newWordsPerDay)

  const today = todayKey()
  const forecast = useMemo(() => reviewForecast(progress, today), [progress, today])

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
          {newWordsPerDay > 0
            ? `Learn ${newWordsPerDay} new ${newWordsPerDay === 1 ? 'word' : 'words'} a day and review the ones you've learned.`
            : "Review the words you've learned. New words are turned off in Settings."}
        </p>
      </header>

      <TodayCard plan={plan} />

      <section aria-label="Your progress" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Flame}
          label="Study streak"
          value={`${streak.days} ${streak.days === 1 ? 'day' : 'days'}`}
          hint={
            streak.studiedToday
              ? 'You studied today'
              : streak.days > 0
                ? 'Study today to keep your streak'
                : 'Study today to start a streak'
          }
        />
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
          value={`${plan.newLearnedToday} / ${newWordsPerDay}`}
          hint="New words learned today"
        />
        <StatCard
          icon={CalendarCheck}
          label="Due for review"
          value={plan.reviews.length}
          hint="Words to review today"
        />
      </section>

      {learnedCount > 0 && <ReviewForecastCard forecast={forecast} />}

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
