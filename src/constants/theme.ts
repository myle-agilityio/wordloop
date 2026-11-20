import type { Theme } from '@/types'

export interface ThemeOption {
  value: Theme
  label: string
}

/** The theme choices, in the order the header theme menu lists them. */
export const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

/** Matches when the OS is set to dark mode. */
export const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)'
