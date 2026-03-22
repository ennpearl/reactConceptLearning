/** React concept: Service layer + server-state (used by React Query and useFetch<T>). */

import type { Employee, Paginated } from '../types/employee'
import { readJson, writeJson } from './storage'
import { sleep } from '../utils/sleep'
import { uid } from '../utils/id'

const EMP_KEY = 'rm_employees_v1'

function seedEmployees(): Employee[] {
  const depts = ['Engineering', 'Design', 'HR', 'Sales', 'Finance', 'Support']
  const titles = ['Software Engineer', 'Senior Engineer', 'Designer', 'HR Lead', 'Account Exec', 'Analyst']
  const locations = ['New York', 'London', 'Berlin', 'Remote', 'Bangalore', 'Toronto']
  const skills = ['React', 'TypeScript', 'Node.js', 'SQL', 'Figma', 'Leadership', 'Testing', 'Accessibility']

  return Array.from({ length: 250 }, (_, i) => {
    const dept = depts[i % depts.length]
    const title = titles[i % titles.length]
    const loc = locations[i % locations.length]
    const start = new Date(Date.now() - (i + 10) * 24 * 60 * 60 * 1000)
    return {
      id: uid('emp'),
      name: `Employee ${i + 1}`,
      title,
      department: dept,
      location: loc,
      email: `employee${i + 1}@example.com`,
      salaryUsd: 65000 + (i % 20) * 2500,
      startDate: start.toISOString().slice(0, 10),
      status: i % 23 === 0 ? 'on_leave' : 'active',
      skills: [skills[i % skills.length], skills[(i + 2) % skills.length]],
    }
  })
}

function ensureData(): Employee[] {
  const existing = readJson<Employee[] | null>(EMP_KEY, null)
  if (existing && existing.length) return existing
  const seeded = seedEmployees()
  writeJson(EMP_KEY, seeded)
  return seeded
}

function persist(list: Employee[]) {
  writeJson(EMP_KEY, list)
}

export type EmployeeQuery = {
  q?: string
  page?: number
  pageSize?: number
  department?: string
}

export async function listEmployees(query: EmployeeQuery, signal?: AbortSignal): Promise<Paginated<Employee>> {
  // Simulate network latency + cancellation support (useEffect cleanup, AbortController).
  await sleep(450, signal)

  const all = ensureData()
  const q = query.q?.trim().toLowerCase() ?? ''
  const department = query.department?.trim()
  const page = Math.max(1, query.page ?? 1)
  const pageSize = Math.min(50, Math.max(5, query.pageSize ?? 20))

  const filtered = all.filter((e) => {
    if (department && department !== 'All' && e.department !== department) return false
    if (!q) return true
    return (
      e.name.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q)
    )
  })

  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return { items, total: filtered.length, page, pageSize }
}

export async function getEmployee(id: string, signal?: AbortSignal): Promise<Employee> {
  await sleep(250, signal)
  const all = ensureData()
  const emp = all.find((e) => e.id === id)
  if (!emp) throw new Error('Employee not found')
  return emp
}

export async function createEmployee(input: Omit<Employee, 'id'>, signal?: AbortSignal): Promise<Employee> {
  await sleep(350, signal)
  const all = ensureData()
  const emp: Employee = { ...input, id: uid('emp') }
  const next = [emp, ...all]
  persist(next)
  return emp
}

export async function updateEmployee(
  id: string,
  patch: Partial<Omit<Employee, 'id'>>,
  signal?: AbortSignal,
): Promise<Employee> {
  await sleep(300, signal)
  const all = ensureData()
  const idx = all.findIndex((e) => e.id === id)
  if (idx < 0) throw new Error('Employee not found')
  const updated = { ...all[idx], ...patch }
  const next = [...all]
  next[idx] = updated
  persist(next)
  return updated
}

