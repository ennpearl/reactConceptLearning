/** React concept: Patterns (Container/Presenter separation). */

import { useQuery } from '@tanstack/react-query'
import { listEmployees } from '../services/employeeService'
import { Spinner } from './Spinner'

export function EmployeeCountPresenter({ total }: { total: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
      Total employees (from server-state): <b>{total}</b>
    </div>
  )
}

export function EmployeeCountContainer() {
  const q = useQuery({
    queryKey: ['employees', { page: 1, pageSize: 5 }],
    queryFn: ({ signal }) => listEmployees({ page: 1, pageSize: 5 }, signal),
  })

  if (q.isLoading) return <Spinner label="Loading count…" />
  if (q.isError)
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-slate-900">
        {(q.error as Error).message}
      </div>
    )

  return <EmployeeCountPresenter total={q.data!.total} />
}

