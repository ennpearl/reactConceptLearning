/** React concept: TypeScript props + domain typing used across components/hooks/services. */

export type EmployeeStatus = 'active' | 'on_leave' | 'terminated'

export interface Employee {
  id: string
  name: string
  title: string
  department: string
  location: string
  email: string
  salaryUsd: number
  startDate: string // ISO date string
  status: EmployeeStatus
  skills: string[]
  avatarUrl?: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

