/** React concept: Patterns (Higher-Order Component) for cross-cutting concerns. */

import type { ComponentType } from 'react'
import { useAuth } from '../context/AuthContext'

export function withRole<P extends object>(
  Wrapped: ComponentType<P>,
  allowed: Array<'admin' | 'manager' | 'employee'>,
) {
  return function WithRole(props: P) {
    const { user } = useAuth()
    if (!user) return null
    if (!allowed.includes(user.role)) {
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-slate-900">
          Not authorized for role: <b>{user.role}</b>
        </div>
      )
    }
    return <Wrapped {...(props as P)} />
  }
}

