import { Eye, EyeOff } from 'lucide-react'
import { useState, type ComponentProps } from 'react'

import { TextField } from './TextField'

type PasswordFieldProps = Omit<ComponentProps<typeof TextField>, 'type' | 'trailing'>

/** A password input with a button that shows or hides what was typed. */
export function PasswordField(props: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)
  const Icon = isVisible ? EyeOff : Eye

  return (
    <TextField
      {...props}
      type={isVisible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
          className="flex size-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none"
        >
          <Icon className="size-4" aria-hidden />
        </button>
      }
    />
  )
}
