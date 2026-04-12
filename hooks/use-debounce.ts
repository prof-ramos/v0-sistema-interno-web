'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

function normalizeDataSnapshot(value: unknown, ancestors = new WeakSet<object>()): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  // Guard against circular references (track only ancestor chain, not all visited)
  if (ancestors.has(value as object)) {
    return '"[Circular]"'
  }
  ancestors.add(value as object)

  let result: string

  if (Array.isArray(value)) {
    result = `[${value.map((item) => normalizeDataSnapshot(item, ancestors)).join(',')}]`
  } else {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b)
    )
    result = `{${entries
      .map(([key, entryValue]) => `${JSON.stringify(key)}:${normalizeDataSnapshot(entryValue, ancestors)}`)
      .join(',')}}`
  }

  // Remove from ancestor chain after processing (shared refs are OK, only cycles are flagged)
  ancestors.delete(value as object)

  return result
}

export function createDataSnapshot<T>(value: T): string {
  return normalizeDataSnapshot(value)
}

/**
 * Hook para debounce de valores
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

type DebouncedArgs = unknown[]

/**
 * Hook para debounce de callbacks
 */
export function useDebouncedCallback<Args extends DebouncedArgs>(
  callback: (...args: Args) => void | Promise<void>,
  delay: number,
  onError?: (err: unknown) => void
): (...args: Args) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)
  const onErrorRef = useRef(onError)
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])
  
  const debouncedCallback = useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        const promise = callbackRef.current(...args)
        if (promise instanceof Promise) {
          promise.catch((err) => {
            console.error('[useDebouncedCallback] Unhandled rejection:', err)
            onErrorRef.current?.(err)
          })
        }
      }, delay)
    },
    [delay]
  )
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  return debouncedCallback
}

/**
 * Hook para auto-save com debounce
 */
export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => void | Promise<void>,
  delay: number = 1000,
  enabled: boolean = true
) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveError, setSaveError] = useState<unknown>(null)
  const previousSnapshotRef = useRef(createDataSnapshot(data))
  const currentSnapshot = useMemo(() => createDataSnapshot(data), [data])
  
  const handleSaveError = useCallback((err: unknown) => {
    setSaveError(err)
    // setIsSaving(false) is handled by debouncedSave's finally block — no redundant call
  }, [])

  const debouncedSave = useDebouncedCallback(async (newData: T, snapshot: string) => {
    try {
      setSaveError(null)
      await onSave(newData)
      previousSnapshotRef.current = snapshot
      setLastSaved(new Date())
    } finally {
      setIsSaving(false)
    }
  }, delay, handleSaveError)
  
  useEffect(() => {
    if (!enabled) {
      // Don't reset previousSnapshotRef when disabled — let changes accumulate
      // so they'll be detected when enabled flips back to true
      setIsSaving(false)
      return
    }

    const hasChanged = currentSnapshot !== previousSnapshotRef.current
    
    if (hasChanged) {
      setIsSaving(true)
      debouncedSave(data, currentSnapshot)
    }
  }, [currentSnapshot, data, debouncedSave, enabled])
  
  return {
    isSaving,
    lastSaved,
    saveError,
  }
}
