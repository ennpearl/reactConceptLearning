/** React concept: Custom hook + generics + persistent state with localStorage. */

import { useCallback, useEffect, useState } from 'react'
import { readJson, writeJson } from '../services/storage'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readJson<T>(key, initialValue))

  useEffect(() => {
    writeJson(key, value)
  }, [key, value])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return { value, setValue, reset } as const
}

