/** React concept: Error Boundaries (class component) + error fallback UI. */

import React from 'react'
import { Button } from './Button'

type Props = {
  children: React.ReactNode
  fallback?: (error: Error, reset: () => void) => React.ReactNode
}

type State = { error: Error | null }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    // Intentionally minimal: demo of the lifecycle hook.
    console.error('ErrorBoundary caught:', error)
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (error) {
      if (this.props.fallback) return this.props.fallback(error, this.reset)
      return (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-slate-900">
          <div className="text-sm font-semibold">Something went wrong.</div>
          <div className="mt-1 text-xs text-slate-700">{error.message}</div>
          <div className="mt-3">
            <Button variant="secondary" onClick={this.reset}>
              Try again
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

