import { useEffect, useEffectEvent } from 'react'

type ShortcutMap = Record<string, () => void>

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

/** Calls the handler for a pressed key (e.g. " ", "1"), ignoring keys typed into form fields. */
export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
    if (isTypingTarget(event.target)) return

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
