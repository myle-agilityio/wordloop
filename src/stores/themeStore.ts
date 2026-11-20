import { create } from 'zustand'

import { readStoredTheme, storeTheme } from '@/lib'
import type { Theme } from '@/types'

interface ThemeState {
  theme: Theme
  /** Uses the theme and saves it on this device. */
  setTheme: (theme: Theme) => void
}

/** The theme choice, kept per device in localStorage. */
export const useThemeStore = create<ThemeState>()((set) => ({
  theme: readStoredTheme(),
  setTheme: (theme) => {
    storeTheme(theme)
    set({ theme })
  },
}))
