/** React concept: Performance (React.memo) + typed props for list rows. */

import { memo } from 'react'
import type { Employee } from '../types/employee'
import { cn } from '../utils/cn'

export interface EmployeeRowProps {
  employee: Employee
  onClick?: (id: string) => void
  selected?: boolean
}

export const EmployeeRow = memo(function EmployeeRow({ employee, onClick, selected }: EmployeeRowProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(employee.id)}
      className={cn(
        'flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm transition',
        selected
          ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/40'
          : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800',
      )}
    >
      <div className="min-w-0">
        <div className="truncate font-medium">{employee.name}</div>
        <div className="truncate text-xs text-slate-600 dark:text-slate-300">
          {employee.title} · {employee.department} · {employee.location}
        </div>
      </div>
      <div className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{employee.status}</div>
    </button>
  )
})

