import { useSyncExternalStore } from 'react'

import { canSpeak, onVoicesChanged } from '@/lib'

/** Whether the browser can read words aloud. Re-renders when the voice list loads, which often happens after the page. */
export function useCanSpeak(): boolean {
  return useSyncExternalStore(onVoicesChanged, canSpeak, () => false)
}
