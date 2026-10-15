import type { BadgeTone } from '@/components/ui'
import type { CardProgress, DateKey } from '@/types'
import { formatDueLabel } from '@/utils/date'

export type WordStatusKind = 'not-started' | 'due' | 'scheduled'

export interface WordStatus {
  kind: WordStatusKind
  label: string
  tone: BadgeTone
}

export function getWordStatus(progress: CardProgress | undefined, today: DateKey): WordStatus {
  if (!progress) return { kind: 'not-started', label: 'Not started', tone: 'neutral' }
  if (progress.dueOn <= today) return { kind: 'due', label: 'Due today', tone: 'amber' }
  return {
    kind: 'scheduled',
    label: `Review ${formatDueLabel(progress.dueOn, today)}`,
    tone: 'emerald',
  }
}
