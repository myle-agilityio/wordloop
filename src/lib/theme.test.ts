import { afterEach, describe, expect, it, vi } from 'vitest'

import { DARK_MEDIA_QUERY, THEME_STORAGE_KEY } from '@/constants'

import {
  applyTheme,
  getPrefersDark,
  isTheme,
  nextTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
  subscribeToPrefersDark,
} from './theme'

const fakeStorage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

/** A matchMedia stub whose `change` listeners can be fired by the test. */
const fakeMatchMedia = (matches: boolean) => {
  const listeners = new Set<() => void>()
  const query = {
    matches,
    addEventListener: vi.fn((_: string, listener: () => void) => listeners.add(listener)),
    removeEventListener: vi.fn((_: string, listener: () => void) => listeners.delete(listener)),
  }
  const matchMedia = vi.fn(() => query)
  const change = (next: boolean) => {
    query.matches = next
    listeners.forEach((listener) => listener())
  }
  return { matchMedia, query, change, listeners }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('isTheme', () => {
  it('accepts the three choices only', () => {
    expect(['light', 'dark', 'system'].every(isTheme)).toBe(true)
    expect(isTheme('blue')).toBe(false)
    expect(isTheme(null)).toBe(false)
  })
})

describe('nextTheme', () => {
  it('cycles Light → Dark → System → Light', () => {
    expect(nextTheme('light')).toBe('dark')
    expect(nextTheme('dark')).toBe('system')
    expect(nextTheme('system')).toBe('light')
  })
})

describe('resolveTheme', () => {
  it('keeps an explicit choice whatever the OS says', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('follows the OS for System', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })
})

describe('readStoredTheme / storeTheme', () => {
  it('defaults to System when nothing is saved', () => {
    vi.stubGlobal('localStorage', fakeStorage())
    expect(readStoredTheme()).toBe('system')
  })

  it('reads back a saved choice', () => {
    vi.stubGlobal('localStorage', fakeStorage())
    storeTheme('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('ignores an invalid saved value', () => {
    vi.stubGlobal('localStorage', fakeStorage({ [THEME_STORAGE_KEY]: 'blue' }))
    expect(readStoredTheme()).toBe('system')
  })

  it('falls back to System and does not throw when storage is blocked', () => {
    const blocked = () => {
      throw new Error('SecurityError')
    }
    vi.stubGlobal('localStorage', { getItem: blocked, setItem: blocked })
    expect(readStoredTheme()).toBe('system')
    expect(() => storeTheme('dark')).not.toThrow()
  })
})

describe('getPrefersDark / subscribeToPrefersDark', () => {
  it('reads the OS setting from the dark media query', () => {
    const { matchMedia } = fakeMatchMedia(true)
    vi.stubGlobal('matchMedia', matchMedia)
    expect(getPrefersDark()).toBe(true)
    expect(matchMedia).toHaveBeenCalledWith(DARK_MEDIA_QUERY)
  })

  it('is false where matchMedia does not exist', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(getPrefersDark()).toBe(false)
    expect(() => subscribeToPrefersDark(() => {})()).not.toThrow()
  })

  it('calls back when the OS setting changes, until unsubscribed', () => {
    const { matchMedia, change, listeners } = fakeMatchMedia(false)
    vi.stubGlobal('matchMedia', matchMedia)
    const callback = vi.fn()

    const unsubscribe = subscribeToPrefersDark(callback)
    change(true)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(getPrefersDark()).toBe(true)

    unsubscribe()
    expect(listeners.size).toBe(0)
  })
})

describe('applyTheme', () => {
  it('adds the dark class for dark and removes it for light', () => {
    const classes = new Set<string>()
    const root = {
      classList: {
        toggle: (name: string, force: boolean) =>
          force ? classes.add(name) : classes.delete(name),
      },
    } as unknown as HTMLElement

    applyTheme('dark', root)
    expect(classes.has('dark')).toBe(true)
    applyTheme('light', root)
    expect(classes.has('dark')).toBe(false)
  })
})
