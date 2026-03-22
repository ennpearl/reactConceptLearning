/** React concept: Services + async effects (used by hooks like useFetch/useEffect cleanup demos). */

export function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => resolve(), ms)
    if (signal) {
      const onAbort = () => {
        clearTimeout(id)
        reject(new DOMException('Aborted', 'AbortError'))
      }
      if (signal.aborted) return onAbort()
      signal.addEventListener('abort', onAbort, { once: true })
    }
  })
}

