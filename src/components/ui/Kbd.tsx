import type { ReactNode } from 'react'

// Shown only with a mouse or trackpad, since touch-only devices have no keyboard to press it on
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-500 pointer-fine:inline">
      {children}
    </kbd>
  )
}
