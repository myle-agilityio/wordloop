import { use } from 'react'

import { getWords } from '@/api/words'
import type { Word } from '@/types'

/** Returns the word list. Suspends until it has loaded, so render inside a <Suspense> boundary. */
export function useWords(): Word[] {
  return use(getWords())
}
