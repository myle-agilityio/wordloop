import { Suspense } from 'react'
import { Outlet } from 'react-router'

import { Footer } from './Footer'
import { Header } from './Header'
import { PageLoader } from './PageLoader'
import { SaveErrorBanner } from './SaveErrorBanner'

export function AppLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
        <SaveErrorBanner />
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
