'use client'

import { useState, useCallback, useMemo } from 'react'
import type { ValidationRule } from '@/lib/validations'
import type { ValidationError } from '@/lib/types'

export interface UseValidationOptions<T extends Record<string, unknown>> {
  rules: Partial<Record<keyof T, ValidationRule[]>>
  validateOnChange?: boolean
}

export interface UseValidationReturn<T extends Record<string, unknown>> {
  errors: Record<string, string>
  touched: Record<string, boolean>
  isValid: boolean
  validateField: (field: keyof T, value: unknown) => string | null
  validateAll: (data: T) => boolean
  setTouched: (field: keyof T) => void
  setAllTouched: () => void
  clearErrors: () => void
  clearField: (field: keyof T) => void
  getFieldError: (field: keyof T) => string | undefined
  isFieldValid: (field: keyof T) => boolean
}

export function useValidation<T extends Record<string, unknown>>(
  options: UseValidationOptions<T>
): UseValidationReturn<T> {
  const { rules, validateOnChange = true } = options
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouchedState] = useState<Record<string, boolean>>({})
  
  const validateField = useCallback(
    (field: keyof T, value: unknown, formData?: T): string | null => {
      const fieldRules = rules[field]
      if (!fieldRules) return null
      
      for (const rule of fieldRules) {
        if (!rule.validate(value as string, formData as Record<string, unknown>)) {
          if (validateOnChange) {
            setErrors((prev) => ({ ...prev, [field]: rule.message }))
          }
          return rule.message
        }
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
    [rules, validateOnChange]
  )
  
  const validateAll = useCallback(
    (data: T): boolean => {
      const newErrors: Record<string, string> = {}
      
      for (const [field, fieldRules] of Object.entries(rules)) {
        if (!fieldRules) continue
        
        const value = data[field as keyof T]
        
        for (const rule of fieldRules as ValidationRule[]) {
          if (!rule.validate(value as string, data as Record<string, unknown>)) {
            newErrors[field] = rule.message
            break
          }
        }
      }
      
      setErrors(newErrors)
      
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {}
      for (const field of Object.keys(rules)) {
        allTouched[field] = true
      }
      setTouchedState(allTouched)
      
      return Object.keys(newErrors).length === 0
    },
    [rules]
  )
  
  const setTouched = useCallback((field: keyof T) => {
    setTouchedState((prev) => ({ ...prev, [field]: true }))
  }, [])
  
  const setAllTouched = useCallback(() => {
    const allTouched: Record<string, boolean> = {}
    for (const field of Object.keys(rules)) {
      allTouched[field] = true
    }
    setTouchedState(allTouched)
  }, [rules])
  
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
