import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'

import { THEME_OPTIONS } from '@/constants'
import { useTheme } from '@/hooks'
import { nextTheme } from '@/lib'
import type { Theme } from '@/types'

const THEME_ICONS: Record<Theme, LucideIcon> = { light: Sun, dark: Moon, system: Monitor }

const themeLabel = (theme: Theme) => THEME_OPTIONS.find((option) => option.value === theme)?.label

/** One button that cycles Light → Dark → System; its icon and label show the current choice. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const next = nextTheme(theme)
  const Icon = THEME_ICONS[theme]
  const label = `Theme: ${themeLabel(theme)}. Switch to ${themeLabel(next)}`

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    >
      <Icon className="size-4" aria-hidden />
    </button>
  )
}
