import { resolveTheme } from '@/lib'
import { useThemeStore } from '@/stores'

import { usePrefersDark } from './usePrefersDark'

/** The theme choice, the theme actually shown, and a setter that saves the choice. */
export function useTheme() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const prefersDark = usePrefersDark()

  return { theme, resolvedTheme: resolveTheme(theme, prefersDark), setTheme }
}
