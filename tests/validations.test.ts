import test from 'node:test'
import assert from 'node:assert/strict'

import {
  cpf,
  cnpj,
  cpfOrCnpj,
  maskCPFOrCNPJ,
  maskPhone,
  validate,
  required,
} from '../lib/validations'

test('cpf validation accepts valid CPF and rejects invalid ones', () => {
  assert.equal(cpf().validate('529.982.247-25'), true)
  assert.equal(cpf().validate('52998224725'), true)
  assert.equal(cpf().validate('111.111.111-11'), false)
  assert.equal(cpf().validate('123.456.789-00'), false)
  assert.equal(cpf().validate(''), false)
  assert.equal(cpf().validate(undefined as unknown as string), false)
  assert.equal(cpf().validate('529.982.247-25abc'), false)
})

test('cnpj validation accepts valid CNPJ and rejects invalid ones', () => {
  assert.equal(cnpj().validate('45.723.174/0001-10'), true)
  assert.equal(cnpj().validate('45723174000110'), true)
  assert.equal(cnpj().validate('11.111.111/1111-11'), false)
  assert.equal(cnpj().validate('1234567890123'), false)
  assert.equal(cnpj().validate('45.723.174/0001-10abc'), false)
  assert.equal(cnpj().validate('00.000.000/0000-00'), false)
  assert.equal(cnpj().validate(''), false)
  assert.equal(cnpj().validate(null as unknown as string), false)
})

test('cpfOrCnpj delegates based on cleaned length', () => {
  assert.equal(cpfOrCnpj().validate('529.982.247-25'), true)
  assert.equal(cpfOrCnpj().validate('45.723.174/0001-10'), true)
  assert.equal(cpfOrCnpj().validate('123'), false)
})

test('mask helpers format CPF/CNPJ and phone values', () => {
  assert.equal(maskCPFOrCNPJ('52998224725'), '529.982.247-25')
  assert.equal(maskCPFOrCNPJ('45723174000110'), '45.723.174/0001-10')
  assert.equal(maskPhone('11999998888'), '(11) 99999-8888')
})

test('validate returns first error per field and keeps valid fields clean', () => {
  const result = validate(
    { nome: '  ', email: 'ok@example.com' },
    {
      nome: [required('Nome obrigatório')],
      email: [required('E-mail obrigatório')],
    }
  )

  assert.equal(result.isValid, false)
  assert.deepEqual(result.errors, [{ field: 'nome', message: 'Nome obrigatório' }])
})

test('validate returns errors for multiple invalid fields', () => {
  const result = validate(
    { nome: '', email: '' },
    {
      nome: [required('Nome obrigatório')],
      email: [required('E-mail obrigatório')],
    }
  )

  assert.equal(result.isValid, false)
  assert.equal(result.errors.length, 2)
  assert.deepEqual(result.errors, [
    { field: 'nome', message: 'Nome obrigatório' },
    { field: 'email', message: 'E-mail obrigatório' },
  ])
})
