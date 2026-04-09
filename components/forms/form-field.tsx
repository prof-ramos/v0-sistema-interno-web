'use client'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BaseFieldProps {
  label: string
  name: string
  error?: string
  required?: boolean
  hint?: string
  className?: string
}

interface InputFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'url'
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  mask?: (value: string) => string
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea'
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  disabled?: boolean
  rows?: number
}

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select'
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps

export function FormField(props: FormFieldProps) {
  const { label, name, error, required, hint, className } = props

  const fieldId = `field-${name}`
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`
  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined

  return (
    <div className={cn('space-y-2', className)}>
      <Label 
        htmlFor={fieldId}
        className={cn(
          'text-sm font-medium text-foreground',
          error && 'text-destructive'
        )}
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {props.type === 'textarea' ? (
        <Textarea
          id={fieldId}
          name={name}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          onBlur={props.onBlur}
          placeholder={props.placeholder}
          disabled={props.disabled}
          rows={props.rows ?? 4}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'resize-none form-input-focus',
            error && 'border-destructive focus:ring-destructive/20'
          )}
        />
      ) : props.type === 'select' ? (
        <Select
          value={props.value}
          onValueChange={props.onChange}
          disabled={props.disabled}
        >
          <SelectTrigger
            id={fieldId}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className={cn(
              'form-input-focus',
              error && 'border-destructive focus:ring-destructive/20'
            )}
          >
            <SelectValue placeholder={props.placeholder ?? 'Selecione...'} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={fieldId}
          name={name}
          type={props.type}
          value={props.value}
          onChange={(e) => {
            const value = props.mask ? props.mask(e.target.value) : e.target.value
            props.onChange(value)
          }}
          onBlur={props.onBlur}
          placeholder={props.placeholder}
          disabled={props.disabled}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'form-input-focus',
            error && 'border-destructive focus:ring-destructive/20'
          )}
        />
      )}

      {error && (
        <p 
          id={errorId} 
          className="text-xs text-destructive animate-fade-in-slide-up"
          role="alert"
        >
          {error}
        </p>
      )}

      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}
