import type { Word } from '@/types'

const WORDS_URL = '/data/words.json'

let wordsPromise: Promise<Word[]> | undefined

async function fetchWords(): Promise<Word[]> {
  const response = await fetch(WORDS_URL)
  if (!response.ok) throw new Error(`Could not load the word list (${response.status}).`)
  return response.json()
}

/** Loads the word list once and shares the same promise with every caller. */
export function getWords(): Promise<Word[]> {
  wordsPromise ??= fetchWords().catch((error: unknown) => {
    wordsPromise = undefined
    throw error
  })
  return wordsPromise
}
