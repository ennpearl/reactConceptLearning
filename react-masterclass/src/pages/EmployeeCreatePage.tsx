/** React concept: Forms (React Hook Form + Zod, file upload, dynamic fields). */

import { useId, useMemo } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createEmployee } from '../services/employeeService'
import { queryClient } from '../services/queryClient'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email(),
  title: z.string().min(2),
  department: z.string().min(2),
  location: z.string().min(2),
  salaryUsd: z.number().min(30_000).max(500_000),
  startDate: z.string().min(10),
  status: z.enum(['active', 'on_leave', 'terminated']),
  skills: z.array(z.object({ value: z.string().min(1) })).min(1, 'Add at least one skill'),
  avatar: z
    .any()
    .optional()
    .refine((f) => !f || f instanceof FileList, 'Invalid file'),
})

type FormValues = z.infer<typeof schema>

export function EmployeeCreatePage() {
  const navigate = useNavigate()
  const avatarId = useId()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      title: '',
      department: 'Engineering',
      location: 'Remote',
      salaryUsd: 90000,
      startDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      skills: [{ value: 'React' }, { value: 'TypeScript' }],
      avatar: undefined,
    },
    mode: 'onBlur',
  })

  const skills = useFieldArray({ control: form.control, name: 'skills' })

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const avatarFile = values.avatar?.[0] as File | undefined
      const avatarUrl = avatarFile ? URL.createObjectURL(avatarFile) : undefined
      return createEmployee({
        name: values.name,
        email: values.email,
        title: values.title,
        department: values.department,
        location: values.location,
        salaryUsd: values.salaryUsd,
        startDate: values.startDate,
        status: values.status,
        skills: values.skills.map((s) => s.value),
        avatarUrl,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['employees'] })
      navigate('/employees')
    },
  })

  const departments = useMemo(() => ['Engineering', 'Design', 'HR', 'Sales', 'Finance', 'Support'], [])

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold">Add employee</div>
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Demonstrates RHF + Zod validation, file uploads, and dynamic fields.
        </div>
      </div>

      <form
        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
        className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input label="Name" {...form.register('name')} error={form.formState.errors.name?.message} />
          <Input label="Email" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
          <Input label="Title" {...form.register('title')} error={form.formState.errors.title?.message} />
          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">Department</div>
            <select
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              {...form.register('department')}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {form.formState.errors.department?.message ? (
              <div className="mt-1 text-xs text-rose-600">{form.formState.errors.department.message}</div>
            ) : null}
          </label>
          <Input label="Location" {...form.register('location')} error={form.formState.errors.location?.message} />
          <Input
            label="Salary (USD)"
            type="number"
            {...form.register('salaryUsd', { valueAsNumber: true })}
            error={form.formState.errors.salaryUsd?.message}
          />
          <Input
            label="Start date"
            type="date"
            {...form.register('startDate')}
            error={form.formState.errors.startDate?.message}
          />
          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">Status</div>
            <select
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
              {...form.register('status')}
            >
              <option value="active">active</option>
              <option value="on_leave">on_leave</option>
              <option value="terminated">terminated</option>
            </select>
          </label>
        </div>

        <label className="block">
          <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-200">Avatar upload</div>
          <input id={avatarId} type="file" accept="image/*" {...form.register('avatar')} />
          {form.formState.errors.avatar?.message ? (
            <div className="mt-1 text-xs text-rose-600">{String(form.formState.errors.avatar.message)}</div>
          ) : null}
        </label>

        <div>
          <div className="text-sm font-medium">Skills (dynamic fields)</div>
          <div className="mt-2 space-y-2">
            {skills.fields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-2">
                <input
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  {...form.register(`skills.${idx}.value` as const)}
                  placeholder="Skill"
                />
                <Button variant="ghost" type="button" onClick={() => skills.remove(idx)}>
                  Remove
                </Button>
              </div>
            ))}
            {form.formState.errors.skills?.message ? (
              <div className="text-xs text-rose-600">{String(form.formState.errors.skills.message)}</div>
            ) : null}
            <Button variant="secondary" type="button" onClick={() => skills.append({ value: '' })}>
              Add skill
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Creating…' : 'Create employee'}
          </Button>
          {mutation.isError ? <div className="text-xs text-rose-600">{(mutation.error as Error).message}</div> : null}
        </div>
      </form>
    </div>
  )
}

