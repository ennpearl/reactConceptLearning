/** React concept: Router (useSearchParams) + Performance (virtual list) + Hooks (useDeferredValue/useTransition). */

import { useCallback, useDeferredValue, useMemo, useRef, useTransition } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { listEmployees } from '../services/employeeService'
import { Button } from '../components/Button'
import { EmployeeRow } from '../components/EmployeeRow'
import { Spinner } from '../components/Spinner'

function numParam(raw: string | null, fallback: number) {
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

export function EmployeesPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const q = params.get('q') ?? ''
  const dept = params.get('dept') ?? 'All'
  const page = numParam(params.get('page'), 1)
  const pageSize = numParam(params.get('pageSize'), 20)

  // useDeferredValue keeps typing responsive while expensive renders (virtual list) happen.
  const deferredQ = useDeferredValue(q)

  const query = useQuery({
    queryKey: ['employees', { q: deferredQ, dept, page, pageSize }],
    queryFn: ({ signal }) => listEmployees({ q: deferredQ, department: dept, page, pageSize }, signal),
    placeholderData: (prev) => prev,
  })

  const parentRef = useRef<HTMLDivElement | null>(null)
  const rows = query.data?.items ?? []

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  })

  const departments = useMemo(() => ['All', 'Engineering', 'Design', 'HR', 'Sales', 'Finance', 'Support'], [])

  const setParam = useCallback(
    (next: Record<string, string>) => {
      startTransition(() => {
        const merged = new URLSearchParams(params)
        for (const [k, v] of Object.entries(next)) {
          if (!v) merged.delete(k)
          else merged.set(k, v)
        }
        setParams(merged)
      })
    },
    [params, setParams],
  )

  const onRowClick = useCallback((id: string) => navigate(`/employees/${id}`), [navigate])

  const total = query.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xl font-semibold">Employees</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Search, filter, paginate, and render efficiently (virtualized).
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            className="w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            placeholder="Search name, title, email…"
            value={q}
            onChange={(e) => setParam({ q: e.target.value, page: '1' })}
          />
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={dept}
            onChange={(e) => setParam({ dept: e.target.value, page: '1' })}
            aria-label="Department"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={String(pageSize)}
            onChange={(e) => setParam({ pageSize: e.target.value, page: '1' })}
            aria-label="Page size"
          >
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={String(n)}>
                {n} / page
              </option>
            ))}
          </select>
          <Button variant="secondary" onClick={() => void query.refetch()} disabled={query.isFetching}>
            Refresh
          </Button>
        </div>
      </div>

      {query.isLoading ? <Spinner label="Loading employees…" /> : null}
      {query.isError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-slate-900">
          Failed to load: {(query.error as Error).message}
        </div>
      ) : null}

      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
        <div>
          Showing <b>{rows.length}</b> of <b>{total}</b>
          {isPending ? <span className="ml-2 text-xs">(updating…)</span> : null}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" disabled={page <= 1} onClick={() => setParam({ page: String(page - 1) })}>
            Prev
          </Button>
          <div className="text-xs">
            Page <b>{page}</b> / <b>{totalPages}</b>
          </div>
          <Button
            variant="ghost"
            disabled={page >= totalPages}
            onClick={() => setParam({ page: String(page + 1) })}
          >
            Next
          </Button>
        </div>
      </div>

      <div
        ref={parentRef}
        className="h-[520px] overflow-auto rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900"
      >
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualizer.getVirtualItems().map((v) => {
            const employee = rows[v.index]
            return (
              <div
                key={employee?.id ?? v.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${v.start}px)`,
                }}
                className="px-1 py-1"
              >
                {employee ? <EmployeeRow employee={employee} onClick={onRowClick} /> : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

