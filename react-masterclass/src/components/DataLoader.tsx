/** React concept: Patterns (render props) for flexible UI rendering. */

import type { ReactNode } from 'react'
import { Spinner } from './Spinner'
import type { FetchState } from '../hooks/useFetch'

type Props<T> = {
  state: FetchState<T>
  children: (data: T) => ReactNode
}

export function DataLoader<T>({ state, children }: Props<T>) {
  if (state.status === 'idle') return null
  if (state.status === 'loading') return <Spinner />
  if (state.status === 'error')
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-slate-900">
        {state.error.message}
      </div>
    )
  return <>{children(state.data)}</>
}

