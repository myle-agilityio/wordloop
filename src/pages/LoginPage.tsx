import { LoaderCircle, Repeat2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'

import { signIn, signUp } from '@/api'
import { Button, Card, TextField } from '@/components/ui'
import { ROUTES } from '@/constants'
import { useAuth } from '@/hooks'
import { cn } from '@/lib'

type Mode = 'sign-in' | 'sign-up'

const MIN_PASSWORD_LENGTH = 8

export function LoginPage() {
  const { user, isPending } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? ROUTES.home

  const [mode, setMode] = useState<Mode>('sign-in')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  if (!isPending && user) return <Navigate to={redirectTo} replace />

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
    setNotice(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email')).trim()
    const password = String(form.get('password'))

    setIsSubmitting(true)
    setError(null)
    setNotice(null)
    try {
      if (mode === 'sign-in') {
        await signIn(email, password)
      } else {
        const result = await signUp(String(form.get('name')).trim(), email, password)
        if (result === 'verify-email') {
          setNotice('Account created. Check your email to verify it, then sign in.')
          setMode('sign-in')
          return
        }
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isSignUp = mode === 'sign-up'

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pt-4">
      <div className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
          <Repeat2 className="size-7" aria-hidden />
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {isSignUp ? 'Your progress is saved to your account.' : 'Sign in to continue learning.'}
        </p>
      </div>

      <Card>
        <div
          role="tablist"
          aria-label="Sign in or sign up"
          className="mb-6 flex rounded-xl bg-slate-100 p-1"
        >
          {(['sign-in', 'sign-up'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              onClick={() => switchMode(value)}
              className={cn(
                'flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors',
                mode === value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              )}
            >
              {value === 'sign-in' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <TextField label="Name" name="name" autoComplete="name" required maxLength={80} />
          )}
          <TextField label="Email" name="email" type="email" autoComplete="email" required />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            required
            minLength={isSignUp ? MIN_PASSWORD_LENGTH : undefined}
            hint={isSignUp ? `At least ${MIN_PASSWORD_LENGTH} characters.` : undefined}
          />

          {error && (
            <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
            >
              {notice}
            </p>
          )}

          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
            {isSubmitting && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
            {isSignUp ? 'Create account' : 'Sign in'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
