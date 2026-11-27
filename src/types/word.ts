export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition'

export interface Word {
  id: string
  /** Frequency rank: 1 is the most common word. New words are introduced in this order. */
  rank: number
  word: string
  /** US (General American) IPA transcription with stress marks, wrapped in slashes, e.g. `/ˈwɔtɚ/`. */
  ipa: string
  partOfSpeech: PartOfSpeech
  meaning: string
  examples: string[]
}
