import { CloudOff } from 'lucide-react'

import { Button } from '@/components/ui'
import { useProgressStore } from '@/stores/progressStore'

/** Warns when ratings couldn't be saved to the database, with a retry. */
export function SaveErrorBanner() {
  const saveError = useProgressStore((state) => state.saveError)
  const retrySave = useProgressStore((state) => state.retrySave)

  if (!saveError) return null

  return (
    <div
      role="alert"
      className="mb-6 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200"
    >
      <CloudOff className="size-4 shrink-0" aria-hidden />
      <p className="flex-1">Some progress isn&apos;t saved yet. {saveError}</p>
      <Button size="sm" variant="secondary" onClick={() => void retrySave()}>
        Retry
      </Button>
    </div>
  )
}
