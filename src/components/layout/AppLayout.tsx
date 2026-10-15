import { Suspense } from 'react'
import { Outlet } from 'react-router'

import { Header } from './Header'
import { PageLoader } from './PageLoader'
import { SaveErrorBanner } from './SaveErrorBanner'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <SaveErrorBanner />
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
