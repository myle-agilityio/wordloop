import { APP_VERSION, RELEASE_NOTES_URL } from '@/constants'

export function Footer() {
  return (
    <footer className="mx-auto max-w-3xl px-4 pb-8 text-center text-xs text-slate-400">
      <a
        href={RELEASE_NOTES_URL}
        target="_blank"
        rel="noreferrer"
        className="rounded hover:text-slate-600 hover:underline focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
      >
        WordLoop v{APP_VERSION}
      </a>
    </footer>
  )
}
