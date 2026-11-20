import { useSyncExternalStore } from 'react'

import { getPrefersDark, subscribeToPrefersDark } from '@/lib'

/** Whether the OS is set to dark mode. Updates live when the setting changes. */
export function usePrefersDark(): boolean {
  return useSyncExternalStore(subscribeToPrefersDark, getPrefersDark, () => false)
}
