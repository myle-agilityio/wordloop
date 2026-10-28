import { useState, type FormEvent } from 'react'

import { IntervalPreview } from '@/components/settings/IntervalPreview'
import { SettingsSection } from '@/components/settings/SettingsSection'
import { Button, TextField } from '@/components/ui'
import { DEFAULT_SETTINGS, RATING_OPTIONS, SETTINGS_LIMITS } from '@/constants'
import { validateSettings } from '@/lib'
import { useSettingsStore } from '@/stores'
import type { GrowingRating, StudySettings } from '@/types'

type SaveState =
  { kind: 'idle' } | { kind: 'saving' } | { kind: 'saved' } | { kind: 'error'; message: string }

const GROWING_RATINGS = RATING_OPTIONS.filter(
  (option): option is (typeof RATING_OPTIONS)[number] & { value: GrowingRating } =>
    option.value !== 'hard',
)

// An empty input reads as NaN, which validation reports.
const inputValue = (value: number) => (Number.isNaN(value) ? '' : value)

const isSameSettings = (a: StudySettings, b: StudySettings) =>
  JSON.stringify(a) === JSON.stringify(b)

export function SettingsPage() {
  const saved = useSettingsStore((state) => state.settings)
  const save = useSettingsStore((state) => state.save)
  const [draft, setDraft] = useState(saved)
  const [saveState, setSaveState] = useState<SaveState>({ kind: 'idle' })

  const errors = validateSettings(draft)
  const isValid = Object.keys(errors).length === 0
  const isChanged = !isSameSettings(draft, saved)

  const update = (change: (settings: StudySettings) => StudySettings) => {
    setDraft(change)
    setSaveState({ kind: 'idle' })
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!isValid || !isChanged) return

    setSaveState({ kind: 'saving' })
    try {
      await save(draft)
      setSaveState({ kind: 'saved' })
    } catch (error) {
      setSaveState({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Could not save your settings.',
      })
    }
  }

  const { intervalDays, multiplier, newWordsPerDay } = SETTINGS_LIMITS

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-slate-600">
          Choose how many new words you learn and how often words come back. Changes apply from your
          next rating; words already scheduled keep their dates.
        </p>
      </header>

      <SettingsSection title="Daily limit" description="New words added to each day's study.">
        <div className="max-w-48">
          <TextField
            label="New words per day"
            type="number"
            inputMode="numeric"
            min={newWordsPerDay.min}
            max={newWordsPerDay.max}
            step={1}
            value={inputValue(draft.newWordsPerDay)}
            onChange={(event) => {
              const value = event.target.valueAsNumber
              update((settings) => ({ ...settings, newWordsPerDay: value }))
            }}
            error={errors.newWordsPerDay}
            hint="0 turns new words off."
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="First review"
        description="Days until a new word comes back, based on how you rate it the first time. Hard always goes back to this gap."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {RATING_OPTIONS.map(({ value: rating, label }) => (
            <TextField
              key={rating}
              label={`${label} (days)`}
              type="number"
              inputMode="numeric"
              min={intervalDays.min}
              max={intervalDays.max}
              step={1}
              value={inputValue(draft.firstIntervalDays[rating])}
              onChange={(event) => {
                const value = event.target.valueAsNumber
                update((settings) => ({
                  ...settings,
                  firstIntervalDays: { ...settings.firstIntervalDays, [rating]: value },
                }))
              }}
              error={errors[`firstIntervalDays.${rating}`]}
            />
          ))}
        </div>
      </SettingsSection>

      <SettingsSection
        title="Later reviews"
        description="Each time you remember a word, its gap is multiplied, up to the maximum."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {GROWING_RATINGS.map(({ value: rating, label }) => (
            <TextField
              key={rating}
              label={`${label} multiplier`}
              type="number"
              inputMode="decimal"
              min={multiplier.min}
              max={multiplier.max}
              step={0.05}
              value={inputValue(draft.intervalMultiplier[rating])}
              onChange={(event) => {
                const value = event.target.valueAsNumber
                update((settings) => ({
                  ...settings,
                  intervalMultiplier: { ...settings.intervalMultiplier, [rating]: value },
                }))
              }}
              error={errors[`intervalMultiplier.${rating}`]}
            />
          ))}
          <TextField
            label="Maximum gap (days)"
            type="number"
            inputMode="numeric"
            min={intervalDays.min}
            max={intervalDays.max}
            step={1}
            value={inputValue(draft.maxIntervalDays)}
            onChange={(event) => {
              const value = event.target.valueAsNumber
              update((settings) => ({ ...settings, maxIntervalDays: value }))
            }}
            error={errors.maxIntervalDays}
          />
        </div>
        {isValid && (
          <div className="mt-5">
            <IntervalPreview settings={draft} />
          </div>
        )}
      </SettingsSection>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <p role="status" className="mr-auto text-sm">
          {saveState.kind === 'saved' && <span className="text-emerald-700">Settings saved.</span>}
          {saveState.kind === 'error' && <span className="text-rose-600">{saveState.message}</span>}
        </p>
        <Button
          variant="secondary"
          onClick={() => update(() => DEFAULT_SETTINGS)}
          disabled={isSameSettings(draft, DEFAULT_SETTINGS)}
        >
          Reset to defaults
        </Button>
        <Button type="submit" disabled={!isValid || !isChanged || saveState.kind === 'saving'}>
          {saveState.kind === 'saving' ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
