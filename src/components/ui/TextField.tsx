import { useId, type InputHTMLAttributes } from 'react'

import { cn } from '@/lib'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export function TextField({ label, hint, className, id, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={hintId}
        className={cn(
          'h-11 rounded-xl bg-white px-3 text-sm shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400',
          'focus:ring-2 focus:ring-indigo-600 focus:outline-none',
          className,
        )}
        {...props}
      />
      {hint && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  )
}
