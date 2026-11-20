import { Check, Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

import { THEME_OPTIONS } from '@/constants'
import { useTheme } from '@/hooks'
import { cn } from '@/lib'
import type { Theme } from '@/types'

const THEME_ICONS: Record<Theme, LucideIcon> = { light: Sun, dark: Moon, system: Monitor }

/** A header button that opens a menu to pick Light, Dark or System; the current choice is checked. */
export function ThemeMenu() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const current = THEME_OPTIONS.find((option) => option.value === theme) ?? THEME_OPTIONS[0]
  const Icon = THEME_ICONS[current.value]

  useEffect(() => {
    if (!isOpen) return
    // Start keyboard users on the current choice
    itemRefs.current[THEME_OPTIONS.indexOf(current)]?.focus()

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen, current])

  const close = () => {
    setIsOpen(false)
    buttonRef.current?.focus()
  }

  const choose = (value: Theme) => {
    setTheme(value)
    close()
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = itemRefs.current
    const index = items.findIndex((item) => item === document.activeElement)
    const focusItem = (next: number) => {
      event.preventDefault()
      items[(next + items.length) % items.length]?.focus()
    }

    if (event.key === 'ArrowDown') focusItem(index + 1)
    else if (event.key === 'ArrowUp') focusItem(index - 1)
    else if (event.key === 'Home') focusItem(0)
    else if (event.key === 'End') focusItem(items.length - 1)
    else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') setIsOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={`Theme: ${current.label}`}
        title={`Theme: ${current.label}`}
        className={cn(
          'rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none',
          'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
          isOpen && 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
        )}
      >
        <Icon className="size-4" aria-hidden />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label="Theme"
          onKeyDown={handleMenuKeyDown}
          className="absolute right-0 z-20 mt-2 w-40 rounded-xl bg-white p-1 shadow-lg ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700"
        >
          {THEME_OPTIONS.map(({ value, label }, index) => {
            const OptionIcon = THEME_ICONS[value]
            const isCurrent = value === theme
            return (
              <button
                key={value}
                ref={(item) => {
                  itemRefs.current[index] = item
                }}
                type="button"
                role="menuitemradio"
                aria-checked={isCurrent}
                tabIndex={-1}
                onClick={() => choose(value)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors focus:outline-none',
                  'hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800',
                  isCurrent
                    ? 'font-medium text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-700 dark:text-slate-300',
                )}
              >
                <OptionIcon className="size-4" aria-hidden />
                <span className="flex-1">{label}</span>
                {isCurrent && <Check className="size-4" aria-hidden />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
