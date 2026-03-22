/** React concept: Context API + custom hook + default values (theme switching). */

import React, { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export type Theme = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('dark')
  if (theme === 'dark') root.classList.add('dark')
  if (theme === 'system') {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    if (prefersDark) root.classList.add('dark')
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { value: theme, setValue: setTheme } = useLocalStorage<Theme>('rm_theme_v1', 'system')

  // Apply side-effect at render boundaries (simple + reliable for demo app scale).
  // In a production app, you might do this in useEffect for strict side-effect isolation.
  applyTheme(theme)

  const value = useMemo<ThemeContextValue>(() => ({ theme, setTheme }), [setTheme, theme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider />')
  return ctx
}

