export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition'

export interface Word {
  id: string
  /** Frequency rank: 1 is the most common word. New words are introduced in this order. */
  rank: number
  word: string
  partOfSpeech: PartOfSpeech
  meaning: string
  examples: string[]
}
