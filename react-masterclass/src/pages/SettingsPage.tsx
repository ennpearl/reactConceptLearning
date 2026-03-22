/** React concept: Context (Theme) + Custom hook (useForm with useReducer) + controlled inputs. */

import { useId, useMemo } from 'react'
import { Button } from '../components/Button'
import { useTheme } from '../context/ThemeContext'
import { useForm } from '../hooks/useForm'

type SettingsValues = {
  displayName: string
  notifications: boolean
}

export function SettingsPage() {
  const nameId = useId()
  const { theme, setTheme } = useTheme()

  const initial = useMemo<SettingsValues>(() => ({ displayName: 'Ada Lovelace', notifications: true }), [])

  const form = useForm<SettingsValues>(initial, (values) => {
    const errors: Partial<Record<keyof SettingsValues, string>> = {}
    if (values.displayName.trim().length < 2) errors.displayName = 'Display name is too short'
    return errors
  })

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold">Settings</div>
        <div className="text-sm text-slate-600 dark:text-slate-300">Theme via Context; form state via useReducer.</div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="text-sm font-semibold">Theme</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['system', 'light', 'dark'] as const).map((t) => (
            <Button key={t} variant={theme === t ? 'primary' : 'secondary'} onClick={() => setTheme(t)}>
              {t}
            </Button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.submit(() => alert('Saved (demo)'))
        }}
        className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="text-sm font-semibold">Profile (demo)</div>
        <label className="block">
          <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">Display name</div>
          <input
            id={nameId}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={form.values.displayName}
            onChange={(e) => form.onChange('displayName', e.target.value)}
          />
          {form.errors.displayName ? <div className="mt-1 text-xs text-rose-600">{form.errors.displayName}</div> : null}
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.values.notifications}
            onChange={(e) => form.onChange('notifications', e.target.checked)}
          />
          Enable notifications
        </label>

        <div className="flex gap-2">
          <Button type="submit">Save</Button>
          <Button variant="secondary" type="button" onClick={() => form.reset(initial)}>
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}

