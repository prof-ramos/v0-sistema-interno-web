'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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

/**
 * Hook para debounce de callbacks
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)
  
  // Atualiza a referência do callback
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )
  
  // Cleanup no unmount
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
  onSave: (data: T) => void,
  delay: number = 1000,
  enabled: boolean = true
) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const previousDataRef = useRef<T>(data)
  
  const debouncedSave = useDebouncedCallback((newData: T) => {
    setIsSaving(true)
    onSave(newData)
    setLastSaved(new Date())
    setIsSaving(false)
  }, delay)
  
  useEffect(() => {
    if (!enabled) return
    
    // Verifica se os dados mudaram
    const hasChanged = JSON.stringify(data) !== JSON.stringify(previousDataRef.current)
    
    if (hasChanged) {
      previousDataRef.current = data
      debouncedSave(data)
    }
  }, [data, debouncedSave, enabled])
  
  return {
    isSaving,
    lastSaved,
  }
}
