/** React concept: Component composition + refs (forwardRef) for forms. */

import React, { forwardRef } from 'react'
import { cn } from '../utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, ...rest },
  ref,
) {
  return (
    <label className="block">
      {label ? <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">{label}</div> : null}
      <input
        ref={ref}
        className={cn(
          'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
          error ? 'border-rose-400 focus:ring-rose-500' : '',
          className,
        )}
        {...rest}
      />
      {error ? <div className="mt-1 text-xs text-rose-600">{error}</div> : null}
    </label>
  )
})

