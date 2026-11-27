import { describe, expect, it } from 'vitest'

import type { PartOfSpeech, Word } from '@/types'

import wordList from './words.json'

const words = wordList as Word[]

const PARTS_OF_SPEECH: PartOfSpeech[] = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'pronoun',
  'preposition',
]

// user_progress.word_id points to id, so these checks guard users' progress as the list grows
describe('words.json', () => {
  it('has a unique id for every word', () => {
    const ids = words.map((word) => word.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses the word itself as its id', () => {
    for (const word of words) expect(word.id).toBe(word.word)
  })

  it('ranks the words 1..N in order, with no gaps', () => {
    expect(words.map((word) => word.rank)).toEqual(words.map((_, index) => index + 1))
  })

  it.each(words.map((word) => [word.id, word] as const))('%s has every field', (_id, word) => {
    expect(word.word.trim()).not.toBe('')
    expect(word.ipa).toMatch(/^\/[^/\s]+(?: [^/\s]+)*\/$/)
    expect(PARTS_OF_SPEECH).toContain(word.partOfSpeech)
    expect(word.meaning.trim()).not.toBe('')
    expect(word.examples).toHaveLength(2)
    for (const example of word.examples) expect(example.trim()).not.toBe('')
  })
})
