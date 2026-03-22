/** React concept: Patterns (compound components, render props, HOC, container/presenter). */

import { useCallback } from 'react'
import { Tabs } from '../components/Tabs'
import { DataLoader } from '../components/DataLoader'
import { useFetch } from '../hooks/useFetch'
import { listEmployees } from '../services/employeeService'
import { EmployeeCountContainer } from '../components/EmployeeCount'
import { withRole } from '../components/withRole'
import { Button } from '../components/Button'

function AdminOnlyPanel() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
      Admin-only panel (HOC gated).
    </div>
  )
}

const AdminOnly = withRole(AdminOnlyPanel, ['admin'])

export function PatternsPage() {
  const state = useFetch<Awaited<ReturnType<typeof listEmployees>>>(
    ['employees', 'render-props-demo'],
    ({ signal }) => listEmployees({ page: 1, pageSize: 3 }, signal),
    { enabled: true },
  )

  const sayHi = useCallback(() => alert('Hello from a memoized callback!'), [])

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold">Patterns</div>
        <div className="text-sm text-slate-600 dark:text-slate-300">Common reusable patterns in React apps.</div>
      </div>

      <Tabs.Root defaultValue="compound">
        <Tabs.List>
          <Tabs.Trigger value="compound">Compound</Tabs.Trigger>
          <Tabs.Trigger value="renderprops">Render props</Tabs.Trigger>
          <Tabs.Trigger value="hoc">HOC</Tabs.Trigger>
          <Tabs.Trigger value="container">Container/Presenter</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="compound">
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
            This page itself is built with a compound <code>Tabs</code> component.
            <div className="mt-3">
              <Button onClick={sayHi}>Click (useCallback)</Button>
            </div>
          </div>
        </Tabs.Content>

        <Tabs.Content value="renderprops">
          <DataLoader state={state}>
            {(data) => (
              <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
                Render-props list (first 3 employees):
                <ul className="mt-2 list-disc pl-5">
                  {data.items.map((e) => (
                    <li key={e.id}>
                      {e.name} — {e.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </DataLoader>
        </Tabs.Content>

        <Tabs.Content value="hoc">
          <AdminOnly />
        </Tabs.Content>

        <Tabs.Content value="container">
          <EmployeeCountContainer />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

