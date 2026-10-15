import { TriangleAlert } from 'lucide-react'
import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'

import { PageLoader } from '@/components/layout/PageLoader'
import { Button, Card } from '@/components/ui'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { useProgressStore } from '@/stores/progressStore'

/** Shows its child routes only to signed-in users, after their progress has loaded. */
export function RequireAuth() {
  const { user, isPending } = useAuth()
  const location = useLocation()
  const userId = user?.id
  const loadedUserId = useProgressStore((state) => state.userId)
  const status = useProgressStore((state) => state.status)
  const loadError = useProgressStore((state) => state.loadError)
  const loadForUser = useProgressStore((state) => state.loadForUser)

  useEffect(() => {
    if (userId) void loadForUser(userId)
  }, [userId, loadForUser])

  if (isPending) return <PageLoader />
  if (!userId) return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />

  if (status === 'error') {
    return (
      <Card className="text-center">
        <TriangleAlert className="mx-auto size-10 text-amber-500" aria-hidden />
        <h1 className="mt-4 text-lg font-semibold">Couldn&apos;t load your progress</h1>
        <p className="mt-2 text-sm text-slate-600">{loadError}</p>
        <Button className="mt-6" onClick={() => void loadForUser(userId)}>
          Try again
        </Button>
      </Card>
    )
  }

  if (status !== 'ready' || loadedUserId !== userId) return <PageLoader />

  return <Outlet />
}
