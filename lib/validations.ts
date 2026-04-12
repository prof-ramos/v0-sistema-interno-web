import { z } from 'zod'

// ===== SCHEMAS BASE =====

const emailSchema = z.string().email('E-mail inválido')

const cpfSchema = z.string().refine((val) => {
  const clean = val.replace(/\D/g, '')
  if (clean.length !== 11) return false
  if (/^(\d)\1{10}$/.test(clean)) return false
  
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i)
  let digit = (sum * 10) % 11
  if (digit === 10) digit = 0
  if (digit !== parseInt(clean[9])) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i)
  digit = (sum * 10) % 11
  if (digit === 10) digit = 0
  return digit === parseInt(clean[10])
}, 'CPF inválido')

const cnpjSchema = z.string().refine((val) => {
  const clean = val.replace(/\D/g, '')
  if (clean.length !== 14) return false
  if (/^(\d)\1{13}$/.test(clean)) return false
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  
  let sum = 0
  for (let i = 0; i < 12; i++) sum += parseInt(clean[i]) * weights1[i]
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (digit !== parseInt(clean[12])) return false
  
  sum = 0
  for (let i = 0; i < 13; i++) sum += parseInt(clean[i]) * weights2[i]
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return digit === parseInt(clean[13])
}, 'CNPJ inválido')

const cpfOrCnpjSchema = z.string().refine((val) => {
  const clean = val.replace(/\D/g, '')
  if (clean.length === 11) {
    // Basic check for CPF
    return true // We'll delegate to refined schemas if possible, but here we just check length
  }
  if (clean.length === 14) {
    return true
  }
  return false
}, 'CPF ou CNPJ inválido').superRefine((val, ctx) => {
  const clean = val.replace(/\D/g, '')
  if (clean.length === 11) {
    const res = cpfSchema.safeParse(val)
    if (!res.success) res.error.issues.forEach(i => ctx.addIssue(i))
  } else if (clean.length === 14) {
    const res = cnpjSchema.safeParse(val)
    if (!res.success) res.error.issues.forEach(i => ctx.addIssue(i))
  }
})

const phoneSchema = z.string().refine((val) => {
  const clean = val.replace(/\D/g, '')
  return clean.length >= 10 && clean.length <= 11
}, 'Telefone inválido')

const cepSchema = z.string().refine((val) => {
  const clean = val.replace(/\D/g, '')
  return clean.length === 8
}, 'CEP inválido')

// ===== SCHEMAS DE FORMULÁRIO =====

export const cadastroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpfCnpj: cpfOrCnpjSchema,
  tipo: z.enum(['FISICA', 'JURIDICA']),
  email: emailSchema,
  telefone: phoneSchema,
  cep: cepSchema,
  logradouro: z.string().min(1, 'Campo obrigatório'),
  numero: z.string().min(1, 'Campo obrigatório'),
  complemento: z.string().optional().nullable(),
  bairro: z.string().min(1, 'Campo obrigatório'),
  cidade: z.string().min(1, 'Campo obrigatório'),
  uf: z.string().length(2, 'UF deve ter 2 caracteres'),
  observacoes: z.string().optional().nullable(),
  status: z.enum(['ATIVO', 'INATIVO', 'PENDENTE']).default('ATIVO'),
})

// ===== MÁSCARAS =====

function maskCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .slice(0, 14)
}

function maskCNPJ(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18)
}

export function maskCPFOrCNPJ(value: string): string {
  const clean = value.replace(/\D/g, '')
  if (clean.length <= 11) return maskCPF(clean)
  return maskCNPJ(clean)
}

export function maskPhone(value: string): string {
  const clean = value.replace(/\D/g, '')
  if (clean.length <= 10) {
    return clean
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14)
  }
  return clean
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

export function maskCEP(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9)
}
