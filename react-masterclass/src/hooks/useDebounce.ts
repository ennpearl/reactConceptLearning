/** React concept: Custom hook + useEffect cleanup (debouncing). */

import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}

