import { describe, expect, it } from 'vitest'

import { keyBelongsToTarget } from './shortcutTarget'

const el = (tagName: string, isContentEditable = false) => ({ tagName, isContentEditable })

describe('keyBelongsToTarget', () => {
  it('lets Space and Enter press a focused button or link', () => {
    for (const key of [' ', 'Enter']) {
      expect(keyBelongsToTarget(key, el('BUTTON'))).toBe(true)
      expect(keyBelongsToTarget(key, el('A'))).toBe(true)
    }
  })

  it('keeps the other shortcuts working while a button is focused', () => {
    for (const key of ['1', '2', '3', '4', 'p', 'P']) {
      expect(keyBelongsToTarget(key, el('BUTTON'))).toBe(false)
    }
  })

  it('gives every key to form fields and editable text', () => {
    for (const key of [' ', '1', 'p']) {
      expect(keyBelongsToTarget(key, el('INPUT'))).toBe(true)
      expect(keyBelongsToTarget(key, el('TEXTAREA'))).toBe(true)
      expect(keyBelongsToTarget(key, el('SELECT'))).toBe(true)
      expect(keyBelongsToTarget(key, el('DIV', true))).toBe(true)
    }
  })

  it('leaves keys to the page when nothing pressable is focused', () => {
    for (const key of [' ', '1', 'p']) {
      expect(keyBelongsToTarget(key, el('BODY'))).toBe(false)
      expect(keyBelongsToTarget(key, el('DIV'))).toBe(false)
      expect(keyBelongsToTarget(key, null)).toBe(false)
    }
  })
})
