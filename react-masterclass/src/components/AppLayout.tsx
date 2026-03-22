/** React concept: Component composition + React Router nested routes (Outlet). */

import { NavLink, Outlet } from 'react-router-dom'
import { useUiStore } from '../store/uiStore'
import { Button } from './Button'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'block rounded-md px-3 py-2 text-sm',
    isActive
      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-200'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
  )

export function AppLayout() {
  const { sidebarOpen, toggleSidebar } = useUiStore()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={toggleSidebar}>
              {sidebarOpen ? 'Hide' : 'Show'} menu
            </Button>
            <div className="text-sm font-semibold">Employee Dashboard</div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
              value={theme}
              onChange={(e) => setTheme(e.target.value as typeof theme)}
              aria-label="Theme"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <div className="hidden text-sm text-slate-600 dark:text-slate-300 sm:block">{user?.email}</div>
            <Button variant="secondary" onClick={() => void logout()}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[260px_1fr]">
        {sidebarOpen ? (
          <aside className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <nav className="space-y-1">
              <NavLink to="/" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/employees" className={navLinkClass}>
                Employees
              </NavLink>
              <NavLink to="/employees/new" className={navLinkClass}>
                Add employee (forms)
              </NavLink>
              <NavLink to="/patterns" className={navLinkClass}>
                Patterns
              </NavLink>
              <NavLink to="/settings" className={navLinkClass}>
                Settings
              </NavLink>
            </nav>
          </aside>
        ) : null}

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

