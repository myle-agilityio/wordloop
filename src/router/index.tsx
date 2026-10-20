import { createBrowserRouter } from 'react-router'

import { RequireAuth } from '@/components/auth/RequireAuth'
import { AppLayout } from '@/components/layout/AppLayout'
import { NotFound, RouteError } from '@/components/layout/RouteError'
import { ROUTES } from '@/constants'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { StudyPage } from '@/pages/StudyPage'
import { WordsPage } from '@/pages/WordsPage'

export const router = createBrowserRouter([
  {
    Component: AppLayout,
    ErrorBoundary: RouteError,
    children: [
      { path: ROUTES.login, Component: LoginPage },
      {
        Component: RequireAuth,
        children: [
          { path: ROUTES.home, Component: HomePage },
          { path: ROUTES.study, Component: StudyPage },
          { path: ROUTES.words, Component: WordsPage },
        ],
      },
      { path: '*', Component: NotFound },
    ],
  },
])
