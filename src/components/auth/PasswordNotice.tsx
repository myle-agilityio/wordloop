import { Info } from 'lucide-react'

/** Sign-up note until password reset ships (issue #14): there is no way to recover a lost password yet. */
export function PasswordNotice() {
  return (
    <p className="flex gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        Password reset and change aren&apos;t available yet, so please keep your password somewhere
        safe.
      </span>
    </p>
  )
}
