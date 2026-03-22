/** React concept: Hooks (useMemo/useCallback) + Server state (React Query) for dashboards. */

import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listEmployees } from '../services/employeeService'
import { Button } from '../components/Button'
import { Spinner } from '../components/Spinner'

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  )
}

export function DashboardPage() {
  const query = useQuery({
    queryKey: ['employees', { page: 1, pageSize: 50 }],
    queryFn: ({ signal }) => listEmployees({ page: 1, pageSize: 50 }, signal),
  })

  const stats = useMemo(() => {
    const items = query.data?.items ?? []
    const totalSalary = items.reduce((sum, e) => sum + e.salaryUsd, 0)
    const byDept = new Map<string, number>()
    for (const e of items) byDept.set(e.department, (byDept.get(e.department) ?? 0) + 1)
    const topDept = [...byDept.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
    return {
      loaded: items.length,
      totalSalary,
      topDept,
    }
  }, [query.data?.items])

  const refresh = useCallback(() => void query.refetch(), [query])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">Dashboard</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">A real-ish employee dashboard with React concepts.</div>
        </div>
        <Button variant="secondary" onClick={refresh} disabled={query.isFetching}>
          Refresh
        </Button>
      </div>

      {query.isLoading ? <Spinner label="Loading dashboard…" /> : null}
      {query.isError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-slate-900">
          Failed to load: {(query.error as Error).message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Employees loaded (sample)" value={String(stats.loaded)} />
        <StatCard label="Total salary (sample)" value={`$${Math.round(stats.totalSalary).toLocaleString()}`} />
        <StatCard label="Top department (sample)" value={stats.topDept} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        This app uses <b>React Router</b>, <b>Context</b>, <b>Zustand</b>, <b>React Query</b>, <b>custom hooks</b>,{' '}
        <b>memoization</b>, <b>virtual lists</b>, and more. Browse the sidebar pages to see each concept in action.
      </div>
    </div>
  )
}

