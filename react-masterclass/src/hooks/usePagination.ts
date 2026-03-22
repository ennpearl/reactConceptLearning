/** React concept: Custom hook for reusable state logic (pagination). */

import { useCallback, useMemo, useState } from 'react'

export function usePagination(initialPage = 1, initialPageSize = 20) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const next = useCallback(() => setPage((p) => p + 1), [])
  const prev = useCallback(() => setPage((p) => Math.max(1, p - 1)), [])
  const reset = useCallback(() => setPage(1), [])

  const offset = useMemo(() => (page - 1) * pageSize, [page, pageSize])

  return { page, pageSize, setPage, setPageSize, next, prev, reset, offset } as const
}

