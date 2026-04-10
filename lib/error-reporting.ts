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

interface ErrorMetadata {
  digest?: string
  component?: string
  context?: Record<string, unknown>
}

/**
 * Reports an error to the monitoring service.
 * Replace the body with Sentry.captureException(error, { extra }) when ready.
 */
export function reportError(
  error: Error & { digest?: string },
  metadata?: Omit<ErrorMetadata, 'digest'>
): void {
  const payload = {
    message: error.message,
    name: error.name,
    digest: error.digest,
    component: metadata?.component,
    context: metadata?.context,
    timestamp: new Date().toISOString(),
    // stack is intentionally omitted from production logs
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  }

  console.error('[ErrorReport]', payload)

  // TODO: Replace with Sentry integration
  // Sentry.captureException(error, {
  //   extra: payload,
  //   tags: { component: metadata?.component },
  // })
}
