import { useEffect, useEffectEvent } from 'react'

import { keyBelongsToTarget } from '@/lib'

type ShortcutMap = Record<string, () => void>

/** Calls the handler for a pressed key (e.g. " ", "1"), unless the focused field, button or link should get it. */
export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
    const target = event.target instanceof HTMLElement ? event.target : null
    if (keyBelongsToTarget(event.key, target)) return

    const handler = shortcuts[event.key]
    if (!handler) return

    event.preventDefault()
    handler()
  })

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
