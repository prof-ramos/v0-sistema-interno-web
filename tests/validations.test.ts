import test from 'node:test'
import assert from 'node:assert/strict'

import {
  cpfSchema,
  cnpjSchema,
  cpfOrCnpjSchema,
  maskCPFOrCNPJ,
  maskPhone,
  cadastroSchema
} from '../lib/validations'

test('cpfSchema accepts valid CPF and rejects invalid ones', () => {
  assert.equal(cpfSchema.safeParse('529.982.247-25').success, true)
  assert.equal(cpfSchema.safeParse('52998224725').success, true)
  assert.equal(cpfSchema.safeParse('111.111.111-11').success, false)
  assert.equal(cpfSchema.safeParse('123.456.789-00').success, false)
  assert.equal(cpfSchema.safeParse('').success, false)
  assert.equal(cpfSchema.safeParse('529.982.247-25abc').success, false)
})

test('cnpjSchema accepts valid CNPJ and rejects invalid ones', () => {
  assert.equal(cnpjSchema.safeParse('45.723.174/0001-10').success, true)
  assert.equal(cnpjSchema.safeParse('45723174000110').success, true)
  assert.equal(cnpjSchema.safeParse('11.111.111/1111-11').success, false)
  assert.equal(cnpjSchema.safeParse('1234567890123').success, false)
  assert.equal(cnpjSchema.safeParse('45.723.174/0001-10abc').success, false)
  assert.equal(cnpjSchema.safeParse('00.000.000/0000-00').success, false)
  assert.equal(cnpjSchema.safeParse('').success, false)
})

test('cpfOrCnpjSchema delegates based on cleaned length', () => {
  assert.equal(cpfOrCnpjSchema.safeParse('529.982.247-25').success, true)
  assert.equal(cpfOrCnpjSchema.safeParse('45.723.174/0001-10').success, true)
  assert.equal(cpfOrCnpjSchema.safeParse('123').success, false)
})

test('mask helpers format CPF/CNPJ and phone values', () => {
  assert.equal(maskCPFOrCNPJ('52998224725'), '529.982.247-25')
  assert.equal(maskCPFOrCNPJ('45723174000110'), '45.723.174/0001-10')
  assert.equal(maskPhone('11999998888'), '(11) 99999-8888')
})

test('cadastroSchema validates correctly and rejects missing mandatory fields', () => {
  const payloadInvalid = { nome: '  ', email: 'ok@example.com' }
  const resultInvalid = cadastroSchema.safeParse(payloadInvalid)
  assert.equal(resultInvalid.success, false)
  
  const payloadValid = {
    nome: 'Gabriel',
    cpfCnpj: '529.982.247-25',
    tipo: 'FISICA',
    email: 'gabriel@example.com',
    telefone: '(11) 99999-8888',
    cep: '00000-000',
    logradouro: 'Rua A',
    numero: '123',
    bairro: 'Centro',
    cidade: 'SP',
    uf: 'SP',
    status: 'ATIVO'
  }
  const resultValid = cadastroSchema.safeParse(payloadValid)
  assert.equal(resultValid.success, true)
})
