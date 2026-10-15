import { TriangleAlert } from 'lucide-react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

import { buttonClasses, Card } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'

/** Shown when a page fails to render or load, e.g. the word list can't be fetched. */
export function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Something went wrong.'

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-md text-center">
        <TriangleAlert className="mx-auto size-10 text-amber-500" aria-hidden />
        <h1 className="mt-4 text-lg font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <a href={ROUTES.home} className={cn(buttonClasses('primary', 'md'), 'mt-6')}>
          Reload WordLoop
        </a>
      </Card>
    </div>
  )
}

export function NotFound() {
  return (
    <Card className="text-center">
      <h1 className="text-lg font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">We couldn&apos;t find that page.</p>
      <Link to={ROUTES.home} className={cn(buttonClasses('secondary', 'md'), 'mt-6')}>
        Back to today
      </Link>
    </Card>
  )
}
