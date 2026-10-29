import { useId, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  /** Shown under the input in place of the hint, and marks the input invalid. */
  error?: string
}

export function TextField({ label, hint, error, className, id, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const message = error ?? hint
  const hintId = message ? `${inputId}-hint` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={hintId}
        aria-invalid={error ? true : undefined}
        className={cn(
          'h-11 rounded-xl bg-white px-3 text-sm shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400',
          'focus:ring-2 focus:ring-indigo-600 focus:outline-none',
          error && 'ring-rose-300 focus:ring-rose-600',
          className,
        )}
        {...props}
      />
      {message && (
        <p id={hintId} className={cn('text-xs', error ? 'text-rose-600' : 'text-slate-500')}>
          {message}
        </p>
      )}
    </div>
  )
}
