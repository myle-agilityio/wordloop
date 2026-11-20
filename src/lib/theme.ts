import { DARK_MEDIA_QUERY, THEME_OPTIONS, THEME_STORAGE_KEY } from '@/constants'
import type { ResolvedTheme, Theme } from '@/types'

export const isTheme = (value: unknown): value is Theme =>
  THEME_OPTIONS.some((option) => option.value === value)

/** The choice after this one in the header toggle's cycle. */
export function nextTheme(theme: Theme): Theme {
  const index = THEME_OPTIONS.findIndex((option) => option.value === theme)
  return THEME_OPTIONS[(index + 1) % THEME_OPTIONS.length].value
}

export function resolveTheme(theme: Theme, prefersDark: boolean): ResolvedTheme {
  if (theme === 'system') return prefersDark ? 'dark' : 'light'
  return theme
}

/** The saved choice, or System when nothing valid is saved or storage is blocked. */
export function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return isTheme(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

/** Saves the choice on this device. If storage is blocked, it just won't survive a reload. */
export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Blocked storage is not an error worth showing.
  }
}

/** Whether the OS is set to dark mode. False where matchMedia doesn't exist. */
export function getPrefersDark(): boolean {
  return typeof matchMedia === 'function' && matchMedia(DARK_MEDIA_QUERY).matches
}

/** Calls back when the OS dark mode setting changes. Returns the unsubscribe function. */
export function subscribeToPrefersDark(callback: () => void): () => void {
  if (typeof matchMedia !== 'function') return () => {}
  const query = matchMedia(DARK_MEDIA_QUERY)
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

/** Puts the `dark` class on <html>; the Tailwind dark variant and color-scheme follow it. */
export function applyTheme(theme: ResolvedTheme, root: HTMLElement = document.documentElement) {
  root.classList.toggle('dark', theme === 'dark')
}
