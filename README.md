# WordLoop

WordLoop is a vocabulary learning app for the 1,000 most common English words. Each day you learn a few new words with flashcards. Words you've already learned come back for review at the right time, so they stay in your memory.

## How it works

### Flashcards

Each word has one flashcard with two sides:

| Side  | Content                                         |
| ----- | ----------------------------------------------- |
| Front | The word                                        |
| Back  | The meaning, with example sentences              |

Look at the front, try to remember the meaning, then flip the card to check.

### Rating your memory

After flipping a card, rate how well you remembered the word:

- **Easy**: you knew it right away.
- **Medium**: you got it, but had to think.
- **Hard**: you struggled or didn't remember.

### Daily learning

- You learn **5 new words per day**.
- Words you've learned come back for review. Your rating decides when (spaced repetition):
  - **Hard** words come back soon.
  - **Medium** words come back after a while.
  - **Easy** words come back much later.
- Each time you remember a word again, the gap before its next review grows.

## Word list

WordLoop includes **1,000 common English words**. Each word has a meaning and example sentences.

## Status

Early planning. These details are not decided yet:

- Platform (web, mobile or desktop)
- Exact review gaps for each rating
- Meaning language (English definitions or translations)
- Where progress is saved (on the device or in a synced account)

## Project structure

All WordLoop code lives in this `wordloop/` folder.
