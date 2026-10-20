import { LEGACY_PROGRESS_STORAGE_KEY } from '@/constants'
import type { ProgressMap } from '@/types'

/** Progress saved on this device before accounts existed, if any. */
export function readLegacyProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(LEGACY_PROGRESS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as { state?: { progress?: ProgressMap } }
    return parsed.state?.progress ?? {}
  } catch {
    return {}
  }
}

export function clearLegacyProgress(): void {
  try {
    localStorage.removeItem(LEGACY_PROGRESS_STORAGE_KEY)
  } catch {
    // Storage can be unavailable (e.g. private mode); nothing to clear then.
  }
}
