/** React concept: Context API (createContext + Provider pattern + typed useContext). */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { AuthSession, User } from '../types/auth'
import * as authService from '../services/authService'

type AuthContextValue = {
  status: 'loading' | 'authenticated' | 'anonymous'
  user: User | null
  token: string | null
  login: (email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [status, setStatus] = useState<AuthContextValue['status']>('loading')

  useEffect(() => {
    const ctrl = new AbortController()
    authService
      .getSession(ctrl.signal)
      .then((s) => {
        setSession(s)
        setStatus(s ? 'authenticated' : 'anonymous')
      })
      .catch(() => setStatus('anonymous'))
    return () => ctrl.abort()
  }, [])

  const login = useCallback(async (email: string) => {
    setStatus('loading')
    const ctrl = new AbortController()
    const s = await authService.login(email, ctrl.signal)
    setSession(s)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    setStatus('loading')
    const ctrl = new AbortController()
    await authService.logout(ctrl.signal)
    setSession(null)
    setStatus('anonymous')
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user: session?.user ?? null,
      token: session?.token ?? null,
      login,
      logout,
    }),
    [login, logout, session?.token, session?.user, status],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider />')
  return ctx
}

