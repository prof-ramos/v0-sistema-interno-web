/**
 * Error Reporting Abstraction
 *
 * Centralizes error reporting with structured logging.
 * Today: logs to console with metadata.
 * Tomorrow: swap implementation for Sentry.captureException(error).
 *
 * @example
 * ```ts
 * import { reportError } from '@/lib/error-reporting'
 * reportError(error) // structured console.error in dev, Sentry in prod
 * ```
 */

export interface ErrorMetadata {
  digest?: string
  component?: string
  context?: Record<string, unknown>
}

/**
 * Reports an error to the monitoring service.
 * Replace the body with Sentry.captureException(error, { extra }) when ready.
 *
 * Defensively handles null/undefined/non-Error values.
 */
export function reportError(
  error: unknown,
  metadata?: Omit<ErrorMetadata, 'digest'>
): void {
  // Defensive: handle null, undefined, and non-Error values
  const isErrorLike = error != null && typeof error === 'object'

  const message = isErrorLike && 'message' in error
    ? String((error as { message: unknown }).message)
    : String(error ?? 'Unknown error')

  const name = isErrorLike && 'name' in error
    ? String((error as { name: unknown }).name)
    : 'Error'

  const digest = isErrorLike && 'digest' in error
    ? String((error as { digest: unknown }).digest)
    : undefined

  const stack = isErrorLike && 'stack' in error
    ? (error as { stack?: string }).stack
    : undefined

  const payload = {
    message,
    name,
    digest,
    component: metadata?.component,
    context: metadata?.context,
    timestamp: new Date().toISOString(),
    // stack is intentionally omitted from production logs
    ...(process.env.NODE_ENV === 'development' && { stack }),
  }

  console.error('[ErrorReport]', payload)

  // TODO: Replace with Sentry integration
  // Sentry.captureException(error, {
  //   extra: payload,
  //   tags: { component: metadata?.component },
  // })
}
