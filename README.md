# WordLoop

WordLoop is a vocabulary learning app for the 1,000 most common English words. Each day you learn a few new words with flashcards. Words you've already learned come back for review at the right time, so they stay in your memory.

## How it works

### Flashcards

Each word has one flashcard with two sides:

| Side  | Content                             |
| ----- | ----------------------------------- |
| Front | The word                            |
| Back  | The meaning, with example sentences |

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

All WordLoop code lives in this `wordloop/` folder. The first version is a web app built with React, TypeScript, Vite, Tailwind CSS and lucide-react icons.

```
src/
├── api/         # Word list, sign-in and progress requests
├── app/         # App root
├── components/  # UI, grouped by feature (ui, layout, auth, flashcard, study, home, words)
├── constants/   # Routes, ratings, spaced-repetition settings
├── hooks/       # React hooks (auth, words, daily plan, study session, shortcuts)
├── lib/         # Neon client and pure logic: review scheduler, daily plan, word status
├── pages/       # One component per route
├── router/      # Route config
├── stores/      # Progress state (zustand), saved to the database
├── types/       # Shared TypeScript types
└── utils/       # Date helpers
public/data/words.json  # Word list
db/migrations/          # SQL to run once in the Neon SQL Editor
```

## Development

### First-time setup

1. Copy `.env.example` to `.env` and fill in the Neon Auth URL and Data API URL from the Neon console.
2. In the Neon console, open the SQL Editor and run [`db/migrations/001_user_progress.sql`](db/migrations/001_user_progress.sql). It creates the `user_progress` table and the rule that each user can only see their own rows.
3. In the Neon console, open **Data API** and click **Refresh schema cache**. Do this after every change to the database tables.

### Scripts

```sh
npm install
npm run dev          # start the app at http://localhost:5173
npm test             # unit tests
npm run lint         # ESLint
npm run format       # Prettier
npm run typecheck
npm run build
```

### Choices made for this first version

These answer the open questions under [Status](#status) for now and are easy to change:

- **Platform**: web.
- **Review gaps** (`src/constants/srs.ts`): the first review comes after 1 day (Hard), 3 days (Medium) or 7 days (Easy). After that, Medium multiplies the gap by 1.5 and Easy by 2.5. Hard resets it to 1 day.
- **Meanings**: English definitions.
- **Accounts**: sign up and sign in with email and password through Neon Auth.
- **Progress**: saved per account in the `user_progress` table, through the Neon Data API. Row-level security limits each user to their own rows. Progress saved on a device by the earlier version moves into the account at the first sign-in.
- **Word list**: 50 of the 1,000 words so far. Add the rest to `public/data/words.json` in the same format.
