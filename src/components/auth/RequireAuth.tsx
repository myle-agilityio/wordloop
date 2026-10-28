import { TriangleAlert } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'

import { PageLoader } from '@/components/layout/PageLoader'
import { Button, Card } from '@/components/ui'
import { ROUTES } from '@/constants'
import { useAuth } from '@/hooks'
import { useProgressStore, useSettingsStore } from '@/stores'

/** Shows its child routes only to signed-in users, after their progress and settings have loaded. */
export function RequireAuth() {
  const { user, isPending } = useAuth()
  const location = useLocation()
  const userId = user?.id
  const loadedUserId = useProgressStore((state) => state.userId)
  const status = useProgressStore((state) => state.status)
  const loadError = useProgressStore((state) => state.loadError)
  const loadForUser = useProgressStore((state) => state.loadForUser)
  const settingsUserId = useSettingsStore((state) => state.userId)
  const settingsStatus = useSettingsStore((state) => state.status)
  const settingsLoadError = useSettingsStore((state) => state.loadError)
  const loadSettingsForUser = useSettingsStore((state) => state.loadForUser)

  // Both skip the request when that user's data is already loaded or loading.
  const load = useCallback(
    (id: string) => {
      void loadForUser(id)
      void loadSettingsForUser(id)
    },
    [loadForUser, loadSettingsForUser],
  )

  useEffect(() => {
    if (userId) load(userId)
  }, [userId, load])

  if (isPending) return <PageLoader />
  if (!userId) return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />

  if (status === 'error' || settingsStatus === 'error') {
    return (
      <Card className="text-center">
        <TriangleAlert className="mx-auto size-10 text-amber-500" aria-hidden />
        <h1 className="mt-4 text-lg font-semibold">
          Couldn&apos;t load your {status === 'error' ? 'progress' : 'settings'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{loadError ?? settingsLoadError}</p>
        <Button className="mt-6" onClick={() => load(userId)}>
          Try again
        </Button>
      </Card>
    )
  }

  const isLoaded =
    status === 'ready' &&
    loadedUserId === userId &&
    settingsStatus === 'ready' &&
    settingsUserId === userId
  if (!isLoaded) return <PageLoader />

  return <Outlet />
}
