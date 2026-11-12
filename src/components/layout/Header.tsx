import { BookOpen, House, Layers, Repeat2, Settings } from 'lucide-react'
import { Link, NavLink } from 'react-router'

import { ROUTES } from '@/constants'
import { useAuth } from '@/hooks'
import { cn } from '@/lib'

import { UserMenu } from './UserMenu'

const NAV_ITEMS = [
  { to: ROUTES.home, label: 'Today', icon: House },
  { to: ROUTES.study, label: 'Study', icon: Layers },
  { to: ROUTES.words, label: 'Words', icon: BookOpen },
  { to: ROUTES.settings, label: 'Settings', icon: Settings },
]

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link to={ROUTES.home} className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Repeat2 className="size-5" aria-hidden />
          </span>
          WordLoop
        </Link>

        {user && (
          <div className="flex items-center gap-2">
            <nav aria-label="Main">
              <ul className="flex items-center gap-1">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                        )
                      }
                    >
                      <Icon className="size-4" aria-hidden />
                      <span className="hidden sm:inline">{label}</span>
                      <span className="sr-only sm:hidden">{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <UserMenu name={user.name} email={user.email} />
          </div>
        )}
      </div>
    </header>
  )
}
