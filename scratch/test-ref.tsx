import React, { useRef, useEffect } from 'react'
import { FormField } from './components/forms/form-field'

export function TestComponent() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      console.log('Ref captured:', inputRef.current.id)
    }
  }, [])

  return (
    <FormField 
      ref={inputRef}
      label="Teste Ref"
      name="teste"
      type="text"
      value=""
      onChange={() => {}}
    />
  )
}
