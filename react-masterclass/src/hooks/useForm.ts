/** React concept: Custom hook pattern (shared form state + validation). */

import { useCallback, useMemo, useReducer } from 'react'

type Errors<T> = Partial<Record<keyof T, string>>

type Action<T> =
  | { type: 'change'; name: keyof T; value: T[keyof T] }
  | { type: 'setErrors'; errors: Errors<T> }
  | { type: 'reset'; next: T }

function reducer<T extends Record<string, unknown>>(
  state: { values: T; errors: Errors<T> },
  action: Action<T>,
) {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        values: { ...state.values, [action.name]: action.value },
      }
    case 'setErrors':
      return { ...state, errors: action.errors }
    case 'reset':
      return { values: action.next, errors: {} as Errors<T> }
    default:
      return state
  }
}

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate?: (values: T) => Errors<T>,
) {
  // useReducer for complex state transitions (requested concept).
  const [state, dispatch] = useReducer(reducer<T>, { values: initialValues, errors: {} as Errors<T> })

  const onChange = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    dispatch({ type: 'change', name, value })
  }, [])

  const submit = useCallback(
    (onValid: (values: T) => void) => {
      const errors = validate?.(state.values) ?? {}
      dispatch({ type: 'setErrors', errors })
      const hasErrors = Object.values(errors).some(Boolean)
      if (!hasErrors) onValid(state.values)
    },
    [state.values, validate],
  )

  const api = useMemo(
    () => ({
      values: state.values,
      errors: state.errors,
      onChange,
      submit,
      reset: (next: T) => dispatch({ type: 'reset', next }),
    }),
    [onChange, state.errors, state.values, submit],
  )

  return api
}

