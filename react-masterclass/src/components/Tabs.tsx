/** React concept: Patterns (compound components) using Context for internal coordination. */

import React, { createContext, useContext, useMemo, useState } from 'react'
import { cn } from '../utils/cn'

type TabsContextValue = {
  value: string
  setValue: (v: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within <Tabs.Root />')
  return ctx
}

function Root({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [value, setValue] = useState(defaultValue)
  const ctx = useMemo(() => ({ value, setValue }), [value])
  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>
}

function List({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

function Trigger({ value, children }: { value: string; children: React.ReactNode }) {
  const tabs = useTabs()
  const active = tabs.value === value
  return (
    <button
      type="button"
      onClick={() => tabs.setValue(value)}
      className={cn(
        'rounded-md px-3 py-2 text-sm font-medium',
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
      )}
    >
      {children}
    </button>
  )
}

function Content({ value, children }: { value: string; children: React.ReactNode }) {
  const tabs = useTabs()
  if (tabs.value !== value) return null
  return <div className="mt-3">{children}</div>
}

export const Tabs = { Root, List, Trigger, Content } as const

