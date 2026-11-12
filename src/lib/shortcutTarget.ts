/** The parts of the focused element that decide who handles a key. An HTMLElement fits. */
export interface KeyTarget {
  tagName: string
  isContentEditable: boolean
}

const TYPING_TAGS = ['INPUT', 'TEXTAREA', 'SELECT']
const PRESSABLE_TAGS = ['BUTTON', 'A']
const PRESS_KEYS = [' ', 'Enter']

/** True when the focused element should get the key instead of the page shortcuts: typing in fields, pressing buttons and links. */
export function keyBelongsToTarget(key: string, target: KeyTarget | null): boolean {
  if (!target) return false
  if (target.isContentEditable || TYPING_TAGS.includes(target.tagName)) return true
  return PRESS_KEYS.includes(key) && PRESSABLE_TAGS.includes(target.tagName)
}
