/** React concept: Router (useParams typed) + Hooks (useRef) + Server state mutations (React Query). */

import { useEffect, useMemo, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useEmployee } from '../hooks/useEmployee'
import { updateEmployee } from '../services/employeeService'
import { queryClient } from '../services/queryClient'
import { Button } from '../components/Button'
import { Spinner } from '../components/Spinner'
import type { EmployeeStatus } from '../types/employee'

export function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const prevIdRef = useRef<string | null>(null) // useRef for storing a value without re-rendering

  const emp = useEmployee(id ?? '')

  useEffect(() => {
    prevIdRef.current = id ?? null
  }, [id])

  const mutation = useMutation({
    mutationFn: (status: EmployeeStatus) => updateEmployee(id!, { status }),
    onSuccess: (updated) => {
      queryClient.setQueryData(['employee', updated.id], updated)
      void queryClient.invalidateQueries({ queryKey: ['employees'] })
    },
  })

  const formatted = useMemo(() => {
    if (!emp.data) return null
    return {
      salary: `$${emp.data.salaryUsd.toLocaleString()}`,
      started: new Date(emp.data.startDate).toLocaleDateString(),
    }
  }, [emp.data])

  if (!id) return <div className="text-sm text-slate-600 dark:text-slate-300">Missing employee id.</div>
  if (emp.isLoading) return <Spinner label="Loading employee…" />
  if (emp.isError)
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-slate-900">
        Failed to load: {(emp.error as Error).message}
      </div>
    )

  const e = emp.data!

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold">{e.name}</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            {e.title} · {e.department} · {e.location}
          </div>
        </div>
        <Link
          to="/employees"
          className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Back
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Email</div>
          <div className="mt-1 font-medium">{e.email}</div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">Started</div>
          <div className="mt-1 font-medium">{formatted?.started}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Salary</div>
          <div className="mt-1 font-medium">{formatted?.salary}</div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">Skills</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {e.skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-sm font-semibold">Status</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['active', 'on_leave', 'terminated'] as const).map((s) => (
            <Button
              key={s}
              variant={e.status === s ? 'primary' : 'secondary'}
              onClick={() => mutation.mutate(s)}
              disabled={mutation.isPending}
            >
              {s}
            </Button>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Previous route id (stored via <code>useRef</code>): <b>{prevIdRef.current ?? '—'}</b>
        </div>
      </div>
    </div>
  )
}

