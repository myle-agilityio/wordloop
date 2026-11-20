import { beforeEach, describe, expect, it, vi } from 'vitest'

import { THEME_STORAGE_KEY } from '@/constants'

const storage = new Map<string, string>()

vi.stubGlobal('localStorage', {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => void storage.set(key, value),
})

describe('themeStore', () => {
  beforeEach(() => {
    storage.clear()
    vi.resetModules()
  })

  it('starts with System when nothing is saved', async () => {
    const { useThemeStore } = await import('./themeStore')
    expect(useThemeStore.getState().theme).toBe('system')
  })

  it('starts with the choice saved on this device', async () => {
    storage.set(THEME_STORAGE_KEY, 'dark')
    const { useThemeStore } = await import('./themeStore')
    expect(useThemeStore.getState().theme).toBe('dark')
  })

  it('uses and saves a new choice, so it survives a reload', async () => {
    const { useThemeStore } = await import('./themeStore')
    useThemeStore.getState().setTheme('light')

    expect(useThemeStore.getState().theme).toBe('light')
    expect(storage.get(THEME_STORAGE_KEY)).toBe('light')

    vi.resetModules()
    const reloaded = await import('./themeStore')
    expect(reloaded.useThemeStore.getState().theme).toBe('light')
  })
})
