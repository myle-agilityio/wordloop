import { useEffect } from 'react'
import { RouterProvider } from 'react-router'

import { useTheme } from '@/hooks'
import { applyTheme } from '@/lib'
import { router } from '@/router'

export function App() {
  const { resolvedTheme } = useTheme()

  useEffect(() => applyTheme(resolvedTheme), [resolvedTheme])

  return <RouterProvider router={router} />
}
