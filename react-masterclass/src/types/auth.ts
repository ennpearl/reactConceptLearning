/** React concept: Context API typing (AuthContext value) for safe global state. */

export type UserRole = 'admin' | 'manager' | 'employee'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface AuthSession {
  user: User
  token: string
}

