/** React concept: React Router setup + lazy loading (code splitting) + Suspense. */

import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/AppLayout'
import { Spinner } from './components/Spinner'
import { ErrorBoundary } from './components/ErrorBoundary'

const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const EmployeesPage = lazy(() => import('./pages/EmployeesPage').then((m) => ({ default: m.EmployeesPage })))
const EmployeeDetailsPage = lazy(() =>
  import('./pages/EmployeeDetailsPage').then((m) => ({ default: m.EmployeeDetailsPage })),
)
const EmployeeCreatePage = lazy(() =>
  import('./pages/EmployeeCreatePage').then((m) => ({ default: m.EmployeeCreatePage })),
)
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const PatternsPage = lazy(() => import('./pages/PatternsPage').then((m) => ({ default: m.PatternsPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<Spinner label="Loading page…" />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="employees/new" element={<EmployeeCreatePage />} />
              <Route path="employees/:id" element={<EmployeeDetailsPage />} />
              <Route path="patterns" element={<PatternsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="home" element={<Navigate to="/" replace />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
