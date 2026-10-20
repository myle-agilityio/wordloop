# WordLoop

React 19 + TypeScript + Vite app for learning English words with spaced repetition. State lives in Zustand, data in Neon, styles in Tailwind. Import from `src` with the `@/` alias.

## Commands

- `npm run dev`: start the dev server
- `npm run test`: run Vitest
- `npm run lint` / `npm run typecheck` / `npm run format:check`

## Rules

### 1. One component per file

Never put two components in a single file. A small helper component gets its own file too. The file name matches the component name.

```tsx
// ❌ components/study/SessionSummary.tsx
export function SessionSummary() { ... }
function TallyRow() { ... }

// ✅ components/study/SessionSummary.tsx
import { TallyRow } from './TallyRow'
export function SessionSummary() { ... }

// ✅ components/study/TallyRow.tsx
export function TallyRow() { ... }
```

### 2. Put code in the right folder

| Folder           | What goes there                                                           |
| ---------------- | ------------------------------------------------------------------------- |
| `src/api`        | Calls to the backend (Neon, auth)                                         |
| `src/app`        | The root `App` component                                                  |
| `src/components` | Components, grouped by feature (`study`, `words`, ...); shared UI in `ui` |
| `src/constants`  | Constant values (`ROUTES`, `RATING_OPTIONS`, ...)                         |
| `src/hooks`      | Custom hooks (`useXxx`)                                                   |
| `src/lib`        | Pure logic and client setup (`scheduler`, `session`, `neon`)              |
| `src/pages`      | One component per route                                                   |
| `src/router`     | Route definitions                                                         |
| `src/stores`     | Zustand stores                                                            |
| `src/types`      | Shared types                                                              |
| `src/utils`      | Small generic helpers (`date`, ...)                                       |

Tests sit next to the file they test: `scheduler.ts` → `scheduler.test.ts`.

```ts
// ❌ a constant defined inside a component file and imported elsewhere
// components/flashcard/RatingButtons.tsx
export const RATING_OPTIONS = [...]

// ✅ constants/ratings.ts
export const RATING_OPTIONS: RatingOption[] = [...]
```

### 3. One-line comments, always up to date

Write comments on one line. Explain why or what, not how. When you change code, update or remove the comments around it in the same change. A wrong comment is worse than none.

```ts
// ❌ multi-line, describes the obvious
/**
 * This function gets the words.
 * It calls getWords and returns them.
 */
export function useWords(): Word[] { ... }

// ✅
/** Returns the word list. Suspends until it has loaded, so render inside a <Suspense> boundary. */
export function useWords(): Word[] { ... }
```

### 4. Every folder has an index file (except components)

Each folder in `src` has an `index.ts` that exports its public files. Import from the folder, not from the file inside it. Folders that only hold components (`src/components/*`, `src/pages`, `src/app`) don't need one; import components from their own files. Inside a folder, import siblings with a relative path (`./session`), not through its own index.

```ts
// ❌
import { ROUTES } from '@/constants/routes'

// ✅
import { ROUTES } from '@/constants'

// ✅ components: import the file directly
import { SessionSummary } from '@/components/study/SessionSummary'
```

### 5. Use `export *` when exporting everything

In an index file, if every export of a file is public, use `export *` (or `export type *` for type-only files). List names only when you want to hide some exports.

```ts
// ✅ constants/index.ts — every export is public
export * from './ratings'
export * from './routes'
export * from './srs'
export * from './storage'

// ✅ types/index.ts — type-only files
export type * from './progress'
export type * from './word'

// ✅ lib/index.ts — keep nextIntervalDays private, export only scheduleReview
export { scheduleReview } from './scheduler'
```
