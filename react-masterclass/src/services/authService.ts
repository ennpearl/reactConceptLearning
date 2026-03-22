/** React concept: Auth flows for Protected Routes + AuthContext provider pattern. */

import type { AuthSession, User } from '../types/auth'
import { readJson, writeJson } from './storage'
import { sleep } from '../utils/sleep'
import { uid } from '../utils/id'

const SESSION_KEY = 'rm_auth_session_v1'

export async function getSession(signal?: AbortSignal): Promise<AuthSession | null> {
  await sleep(150, signal)
  return readJson<AuthSession | null>(SESSION_KEY, null)
}

export async function login(email: string, signal?: AbortSignal): Promise<AuthSession> {
  await sleep(350, signal)
  const user: User = {
    id: uid('user'),
    name: email.split('@')[0]?.replace('.', ' ') || 'User',
    email,
    role: email.includes('admin') ? 'admin' : email.includes('manager') ? 'manager' : 'employee',
  }
  const session: AuthSession = { user, token: uid('token') }
  writeJson(SESSION_KEY, session)
  return session
}

export async function logout(signal?: AbortSignal): Promise<void> {
  await sleep(150, signal)
  writeJson<AuthSession | null>(SESSION_KEY, null)
}

