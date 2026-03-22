/** React concept: Domain hook (custom hook composition + React Query server-state). */

import { useQuery } from '@tanstack/react-query'
import { getEmployee } from '../services/employeeService'

export function useEmployee(employeeId: string) {
  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: ({ signal }) => getEmployee(employeeId, signal),
    enabled: Boolean(employeeId),
  })
}

