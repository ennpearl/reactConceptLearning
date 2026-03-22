/** React concept: Router fallback route (404) as a page component. */

import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-lg font-semibold">Page not found</div>
      <div className="mt-2 text-slate-600 dark:text-slate-300">
        Go back to <Link className="text-indigo-600 underline" to="/">Dashboard</Link>.
      </div>
    </div>
  )
}

