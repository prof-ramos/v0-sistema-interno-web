'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

function normalizeDataSnapshot(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => normalizeDataSnapshot(item)).join(',')}]`
  }

  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a.localeCompare(b)
  )

  return `{${entries
    .map(([key, entryValue]) => `${JSON.stringify(key)}:${normalizeDataSnapshot(entryValue)}`)
    .join(',')}}`
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
  delay: number
): (...args: Args) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)
  
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  const debouncedCallback = useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        void callbackRef.current(...args)
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
  const previousSnapshotRef = useRef(createDataSnapshot(data))
  const currentSnapshot = useMemo(() => createDataSnapshot(data), [data])
  
  const debouncedSave = useDebouncedCallback(async (newData: T, snapshot: string) => {
    try {
      await onSave(newData)
      previousSnapshotRef.current = snapshot
      setLastSaved(new Date())
    } finally {
      setIsSaving(false)
    }
  }, delay)
  
  useEffect(() => {
    if (!enabled) {
      previousSnapshotRef.current = currentSnapshot
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
  }
}
