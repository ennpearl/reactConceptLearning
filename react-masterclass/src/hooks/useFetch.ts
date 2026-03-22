/** React concept: Custom hook + generics + useEffect cleanup via AbortController. */

import { useEffect, useMemo, useState } from 'react'

export type FetchState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: T | null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: T | null; error: Error }

export function useFetch<T>(
  key: unknown[],
  fetcher: (ctx: { signal: AbortSignal }) => Promise<T>,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true
  const stableKey = useMemo(() => JSON.stringify(key), [key])
  const [state, setState] = useState<FetchState<T>>({ status: 'idle', data: null, error: null })

  useEffect(() => {
    if (!enabled) return
    const ctrl = new AbortController()
    setState((prev) => ({ status: 'loading', data: prev.data, error: null }))

    fetcher({ signal: ctrl.signal })
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return
        const error = err instanceof Error ? err : new Error('Unknown error')
        setState((prev) => ({ status: 'error', data: prev.data, error }))
      })

    return () => ctrl.abort()
    // stableKey is intentionally derived from key so we can pass arrays/objects safely.
  }, [stableKey, enabled, fetcher])

  return state
}

