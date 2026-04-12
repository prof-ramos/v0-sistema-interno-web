'use client'

import { useState, useCallback, useMemo } from 'react'
import { z } from 'zod'

export interface UseValidationOptions<T extends z.ZodRawShape> {
  schema: z.ZodObject<T>
  validateOnChange?: boolean
}

export interface UseValidationReturn<T extends Record<string, any>> {
  errors: Record<string, string>
  touched: Record<string, boolean>
  isValid: boolean
  validateField: (field: keyof T, value: unknown, formData: T) => string | null
  validateAll: (data: T) => boolean
  setTouched: (field: keyof T) => void
  setAllTouched: () => void
  clearErrors: () => void
  clearField: (field: keyof T) => void
  getFieldError: (field: keyof T) => string | undefined
  isFieldValid: (field: keyof T) => boolean
}

/**
 * Hook de validação unificado com Zod.
 * Substitui a implementação customizada anterior.
 */
export function useValidation<T extends Record<string, any>>(
  options: { schema: z.ZodType<T>, validateOnChange?: boolean }
): UseValidationReturn<T> {
  const { schema, validateOnChange = true } = options
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouchedState] = useState<Record<string, boolean>>({})
  
  const validateField = useCallback(
    (field: keyof T, value: unknown, formData: T): string | null => {
      // For field-level validation, we try to parse only that field if possible, 
      // but since Zod schemas might have cross-field dependencies (refine), 
      // we usually parse the full object.
      const result = schema.safeParse({ ...formData, [field]: value })
      
      if (!result.success) {
        const error = result.error.issues.find((issue) => issue.path[0] === field)
        const message = error?.message || null
        
        if (validateOnChange) {
          setErrors((prev) => {
            if (message) {
              return { ...prev, [field as string]: message }
            } else {
              const newErrors = { ...prev }
              delete newErrors[field as string]
              return newErrors
            }
          })
        }
        return message
      }
      
      if (validateOnChange) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[field as string]
          return newErrors
        })
      }
      
      return null
    },
    [schema, validateOnChange]
  )
  
  const validateAll = useCallback(
    (data: T): boolean => {
      const result = schema.safeParse(data)
      
      if (!result.success) {
        const newErrors: Record<string, string> = {}
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as string
          if (!newErrors[field]) {
            newErrors[field] = issue.message
          }
        })
        setErrors(newErrors)
        
        // Mark all fields from schema as touched
        const allTouched: Record<string, boolean> = {}
        // We can't easily iterate keys of a generic schema, but we can use the keys from the error and the data
        Object.keys(data).forEach(key => {
          allTouched[key] = true
        })
        setTouchedState(allTouched)
        
        return false
      }
      
      setErrors({})
      
      const allTouched: Record<string, boolean> = {}
      Object.keys(data).forEach(key => {
        allTouched[key] = true
      })
      setTouchedState(allTouched)
      
      return true
    },
    [schema]
  )
  
  const setTouched = useCallback((field: keyof T) => {
    setTouchedState((prev) => ({ ...prev, [field]: true }))
  }, [])
  
  const setAllTouched = useCallback(() => {
    setTouchedState((prev) => {
      const next: Record<string, boolean> = { ...prev }
      // This is a bit limited for all-touched without a known list of fields,
      // but usually validateAll handles this.
      return next
    })
  }, [])
  
  const clearErrors = useCallback(() => {
    setErrors({})
    setTouchedState({})
  }, [])
  
  const clearField = useCallback((field: keyof T) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field as string]
      return newErrors
    })
    setTouchedState((prev) => {
      const newTouched = { ...prev }
      delete newTouched[field as string]
      return newTouched
    })
  }, [])
  
  const getFieldError = useCallback(
    (field: keyof T): string | undefined => {
      if (!touched[field as string]) return undefined
      return errors[field as string]
    },
    [errors, touched]
  )
  
  const isFieldValid = useCallback(
    (field: keyof T): boolean => {
      return !errors[field as string]
    },
    [errors]
  )
  
  const isValid = useMemo(
    () => Object.keys(errors).length === 0,
    [errors]
  )
  
  return {
    errors,
    touched,
    isValid,
    validateField,
    validateAll,
    setTouched,
    setAllTouched,
    clearErrors,
    clearField,
    getFieldError,
    isFieldValid,
  }
}
