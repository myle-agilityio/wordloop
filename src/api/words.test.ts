import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Word } from '@/types'

const words: Word[] = [
  {
    id: 'w1',
    rank: 1,
    word: 'time',
    partOfSpeech: 'noun',
    meaning: 'what is measured in minutes, hours and days',
    examples: ['We had a great time.'],
  },
]

const okResponse = () => new Response(JSON.stringify(words), { status: 200 })
const errorResponse = (status: number) => new Response(null, { status })

// Re-import so every test starts with an empty module-level cache.
async function loadGetWords() {
  const { getWords } = await import('./words')
  return getWords
}

describe('getWords', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    vi.resetModules()
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches once and shares the result between callers', async () => {
    fetchMock.mockResolvedValue(okResponse())
    const getWords = await loadGetWords()

    const [first, second] = await Promise.all([getWords(), getWords()])

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(first).toEqual(words)
    expect(second).toBe(first)
  })

  it('rejects with the status code when the response is not ok', async () => {
    fetchMock.mockResolvedValue(errorResponse(503))
    const getWords = await loadGetWords()

    await expect(getWords()).rejects.toThrow('503')
  })

  it('fetches again after a failed load', async () => {
    fetchMock.mockResolvedValueOnce(errorResponse(500)).mockResolvedValueOnce(okResponse())
    const getWords = await loadGetWords()

    await expect(getWords()).rejects.toThrow('500')
    await expect(getWords()).resolves.toEqual(words)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
