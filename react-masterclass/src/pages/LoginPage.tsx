/** React concept: Forms (controlled inputs) + Router (useNavigate) + Hooks (useId, useTransition). */

import { useId, useState, useTransition } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const emailId = useId()
  const [email, setEmail] = useState<string>('admin@example.com') // useState with generics
  const [isPending, startTransition] = useTransition()

  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      void auth.login(email).then(() => navigate(location.state?.from ?? '/', { replace: true }))
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-10">
        <div>
          <div className="text-2xl font-semibold">react-masterclass</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Sign in to the Employee Dashboard (try <code>admin@example.com</code> or <code>manager@example.com</code>).
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <Input
            id={emailId}
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus
          />
          <div className="mt-4 flex items-center justify-between">
            <Button type="submit" disabled={isPending || auth.status === 'loading'}>
              {isPending || auth.status === 'loading' ? 'Signing in…' : 'Sign in'}
            </Button>
            <div className="text-xs text-slate-500 dark:text-slate-400">Demo auth (localStorage)</div>
          </div>
        </form>
      </div>
    </div>
  )
}

