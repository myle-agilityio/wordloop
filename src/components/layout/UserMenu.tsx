import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router'

import { signOut } from '@/api'
import { ROUTES } from '@/constants'
import { useProgressStore, useSettingsStore } from '@/stores'

interface UserMenuProps {
  name: string
  email: string
}

export function UserMenu({ name, email }: UserMenuProps) {
  const navigate = useNavigate()
  const clearProgress = useProgressStore((state) => state.clear)
  const clearSettings = useSettingsStore((state) => state.clear)

  const handleSignOut = async () => {
    await signOut()
    clearProgress()
    clearSettings()
    navigate(ROUTES.login, { replace: true })
  }

  return (
    <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
      <span className="hidden max-w-36 truncate text-sm text-slate-600 md:block" title={email}>
        {name || email}
      </span>
      <button
        type="button"
        onClick={handleSignOut}
        aria-label="Sign out"
        title="Sign out"
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
      >
        <LogOut className="size-4" aria-hidden />
      </button>
    </div>
  )
}
