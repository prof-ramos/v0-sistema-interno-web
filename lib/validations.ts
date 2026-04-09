import type { ValidationResult, ValidationError } from './types'

// ===== TIPOS DE VALIDAÇÃO =====

export type ValidationRule<T = string> = {
  validate: (value: T, formData?: Record<string, unknown>) => boolean
  message: string
}

// ===== REGRAS DE VALIDAÇÃO =====

export const required = (message = 'Este campo e obrigatorio'): ValidationRule => ({
  validate: (value) => {
    if (typeof value === 'string') return value.trim().length > 0
    return value !== null && value !== undefined
  },
  message,
})

export const minLength = (min: number, message?: string): ValidationRule => ({
  validate: (value) => typeof value === 'string' && value.length >= min,
  message: message || `Minimo de ${min} caracteres`,
})

export const maxLength = (max: number, message?: string): ValidationRule => ({
  validate: (value) => typeof value === 'string' && value.length <= max,
  message: message || `Maximo de ${max} caracteres`,
})

export const email = (message = 'E-mail invalido'): ValidationRule => ({
  validate: (value) => {
    if (!value || typeof value !== 'string') return false
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },
  message,
})

export const cpf = (message = 'CPF invalido'): ValidationRule => ({
  validate: (value) => {
    if (!value || typeof value !== 'string') return false
    const cpfValue = value.trim()
    if (!/^[\d.\-\s]+$/.test(cpfValue)) return false

    const cpfClean = cpfValue.replace(/\D/g, '')
    if (cpfClean.length !== 11) return false
    
    // Validação básica de CPF
    if (/^(\d)\1{10}$/.test(cpfClean)) return false
    
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpfClean[i]) * (10 - i)
    }
    let digit = (sum * 10) % 11
    if (digit === 10) digit = 0
    if (digit !== parseInt(cpfClean[9])) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpfClean[i]) * (11 - i)
    }
    digit = (sum * 10) % 11
    if (digit === 10) digit = 0
    return digit === parseInt(cpfClean[10])
  },
  message,
})

export const cnpj = (message = 'CNPJ invalido'): ValidationRule => ({
  validate: (value) => {
    if (!value || typeof value !== 'string') return false
    const cnpjValue = value.trim()
    if (!/^[\d./\-\s]+$/.test(cnpjValue)) return false

    const cnpjClean = cnpjValue.replace(/\D/g, '')
    if (cnpjClean.length !== 14) return false
    
    // Validação básica de CNPJ
    if (/^(\d)\1{13}$/.test(cnpjClean)) return false
    
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpjClean[i]) * weights1[i]
    }
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (digit !== parseInt(cnpjClean[12])) return false
    
    sum = 0
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpjClean[i]) * weights2[i]
    }
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    return digit === parseInt(cnpjClean[13])
  },
  message,
})

export const cpfOrCnpj = (message = 'CPF ou CNPJ invalido'): ValidationRule => ({
  validate: (value) => {
    if (!value || typeof value !== 'string') return false
    const documentValue = value.trim()
    if (!/^[\d./\-\s]+$/.test(documentValue)) return false

    const clean = documentValue.replace(/\D/g, '')
    if (clean.length === 11) return cpf().validate(value)
    if (clean.length === 14) return cnpj().validate(value)
    return false
  },
  message,
})

export const phone = (message = 'Telefone invalido'): ValidationRule => ({
  validate: (value) => {
    if (!value || typeof value !== 'string') return false
    const phoneClean = value.replace(/\D/g, '')
    return phoneClean.length >= 10 && phoneClean.length <= 11
  },
  message,
})

export const cep = (message = 'CEP invalido'): ValidationRule => ({
  validate: (value) => {
    if (!value || typeof value !== 'string') return false
    const cepClean = value.replace(/\D/g, '')
    return cepClean.length === 8
  },
  message,
})

export const date = (message = 'Data invalida'): ValidationRule => ({
  validate: (value) => {
    if (!value || typeof value !== 'string') return false
    const dateObj = new Date(value)
    return !isNaN(dateObj.getTime())
  },
  message,
})

export const futureDate = (message = 'A data deve ser futura'): ValidationRule => ({
  validate: (value) => {
    if (!value || typeof value !== 'string') return false
    const dateObj = new Date(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dateObj >= today
  },
  message,
})

export const pattern = (regex: RegExp, message: string): ValidationRule => ({
  validate: (value) => typeof value === 'string' && regex.test(value),
  message,
})

// ===== FUNÇÃO DE VALIDAÇÃO =====

export function validate<T extends Record<string, unknown>>(
  data: T,
  rules: Partial<Record<keyof T, ValidationRule[]>>
): ValidationResult {
  const errors: ValidationError[] = []

  for (const [field, fieldRules] of Object.entries(rules)) {
    if (!fieldRules) continue
    
    const value = data[field]
    
    for (const rule of fieldRules as ValidationRule[]) {
      if (!rule.validate(value as string, data)) {
        errors.push({ field, message: rule.message })
        break // Stop at first error for this field
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ===== VALIDAÇÕES DE FORMULÁRIOS =====

export const cadastroValidationRules = {
  nome: [required(), minLength(3, 'Nome deve ter pelo menos 3 caracteres')],
  cpfCnpj: [required(), cpfOrCnpj()],
  email: [required(), email()],
  telefone: [required(), phone()],
  cep: [required(), cep()],
  logradouro: [required()],
  numero: [required()],
  bairro: [required()],
  cidade: [required()],
  uf: [required()],
}

export const solicitacaoValidationRules = {
  titulo: [required(), minLength(5, 'Titulo deve ter pelo menos 5 caracteres')],
  descricao: [required(), minLength(10, 'Descricao deve ter pelo menos 10 caracteres')],
  tipo: [required()],
  prioridade: [required()],
}

export const documentoValidationRules = {
  tipo: [required()],
  titulo: [required(), minLength(3, 'Titulo deve ter pelo menos 3 caracteres')],
  destinatario: [required()],
  remetente: [required()],
  assunto: [required()],
  conteudo: [required(), minLength(10, 'Conteudo deve ter pelo menos 10 caracteres')],
}

// ===== MÁSCARAS =====

export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export function maskCNPJ(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export function maskCPFOrCNPJ(value: string): string {
  const clean = value.replace(/\D/g, '')
  if (clean.length <= 11) return maskCPF(value)
  return maskCNPJ(value)
}

export function maskPhone(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

export function maskCEP(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
}
